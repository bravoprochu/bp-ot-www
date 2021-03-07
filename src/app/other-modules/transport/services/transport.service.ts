import { Observable } from "rxjs/Rx";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { environment } from "environments/environment";
import { TokenService } from "app/services/token.service";
import { catchError, take } from "rxjs/operators";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { Moment } from "moment";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { Subject } from "rxjs";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { IDateRange } from "@bpCommonInterfaces/i-date-range";
import * as moment from "moment";
import { ITransportOffer } from "../interfaces/itransport-offer";
import { ICreationInfo } from "@bpCommonInterfaces/i-creation-info";
import { ICurrencyNbp } from "app/other-modules/currency/interfaces/i-currency-nbp";
import { ILoadTradeInfo } from "@bpCommonInterfaces/iload";

@Injectable()
export class TransportService extends DataFactoryService {
  constructor(
    public http: HttpClient,
    private token: TokenService,
    private contractorService: ContractorService,
    private currencyService: CurrencyCommonService,
    private momentService: MomentCommonService,
    private pTermsService: PaymentTermsService
  ) {
    super(environment.apiUrlTransportOffer, http, token);
  }

  csvConverter(data: any[], tableHeaders: string[]): string {
    if (Array.isArray(data) && data.length > 1) {
      let firstLine: string = "";
      let end = ";";
      let lineEnd = "\r\n";
      let result: string = "";

      //
      // header
      //

      firstLine = tableHeaders.join(end) + lineEnd;

      //
      // loop
      //

      data.forEach((row) => {
        tableHeaders.forEach((header) => {
          let v: string;
          if (row[header] == null) {
            v = "";
          } else {
            v = row[header];
          }
          result += v + end;
        });
        result += lineEnd;
      });

      return firstLine + result;
    }
    return;
  }

  dateRangeLastQuarter(): IDateRange {
    return <IDateRange>{
      dateStart: moment().subtract(3, "month").date(1),
      dateEnd: moment(),
    };
  }

  formCreationInfo(fb: FormBuilder) {
    return fb.group({
      createdBy: [null],
      createdDateTime: [null],
      modifyBy: [null],
      modifyDateTime: [null],
    });
  }

  formTradeInfoGroup(
    fb: FormBuilder,
    isDestroyed$: Subject<boolean>
  ): FormGroup {
    let res = fb.group({
      company: this.contractorService.formCompanyGroup(fb),
      date: [this.momentService.getTodayConstTimeMoment(), Validators.required],
      price: this.currencyService.getCurrencyNbpGroup(fb, isDestroyed$),
      paymentTerms: this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
    });

    res
      .get("date")
      .valueChanges.takeUntil(isDestroyed$)
      .subscribe((s: Moment) => {
        let _day0 = <FormControl>res.get("paymentTerms.day0");
        _day0.setValue(s, { emitEvent: true });
      });
    return res;
  }

  formTransportGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    return fb.group({
      transportOfferId: [null],
      creationInfo: this.formCreationInfo(fb),
      driver: [null],
      info: [null],
      invoiceInPLN: [true],
      invoiceSellId: [null],
      invoiceSellNo: [null],
      offerNo: [null, Validators.required],
      tradeInfo: this.formTradeInfoGroup(fb, isDestroyed$),
      load: this.formTransportAddressShortGroup(fb),
      unload: this.formTransportAddressShortGroup(fb),
    });
  }

  formTransportAddressShortGroup(fb: FormBuilder) {
    return fb.group({
      transportOfferAddressId: [],
      date: [null, Validators.required],
      locality: [null, Validators.required],
      postalCode: [null, Validators.required],
    });
  }

  invoiceSellGen(id: number, invoiceInPLN: boolean): Observable<any> {
    return this.http
      .get(
        environment.apiUrlTransportOfferInvoiceSellGen +
          id +
          "/" +
          invoiceInPLN,
        { headers: this.bearerHeader() }
      )
      .pipe(take(1), catchError(this.errorHandler));
  }

  paginatorLimitOption(length: number): number[] {
    let res: number[] = [];

    if (length > 5) {
      res.push(5);
    }
    if (length > 10) {
      res.push(10);
    }
    if (length > 25) {
      res.push(25);
    }
    if (length > 50) {
      res.push(50);
    }
    if (length > 100) {
      res.push(100);
    }
    if (res.length == 0 || (res.length > 0 && res[res.length - 1] != length)) {
      res.push(length);
    }
    return res;
  }

  paginatorPageSize(length: number): number {
    return length > 10 ? 10 : length;
  }

  patchCreationInfo(info: ICreationInfo, rForm: FormGroup) {
    info.createdDateTime = this.momentService.setFormatedDateTime(
      info.createdDateTime
    );
    info.modifyDateTime = this.momentService.setFormatedDateTime(
      info.modifyDateTime
    );
    rForm.patchValue(info, { emitEvent: false });
  }

  patchTradeInfo(info: ILoadTradeInfo, rForm: FormGroup, fb: FormBuilder) {
    //rForm - formLoadTradeInfoGroup
    //patching companyData
    info.date = this.momentService.convertToConstTime(info.date);
    this.contractorService.patchCompanyData(
      info.company,
      <FormGroup>rForm.get("company"),
      fb
    );
    //this.patchCurrencyNbpData(info.price, <FormGroup>rForm.get('price'));
    this.currencyService.patchCurrencyNbp(
      <ICurrencyNbp>info.price,
      <FormGroup>rForm.get("price")
    );
    this.pTermsService.patchPaymentTerms(
      info.paymentTerms,
      <FormGroup>rForm.get("paymentTerms")
    );
    rForm.patchValue(info, { emitEvent: false, onlySelf: true });
  }

  patchTransport(
    tr: ITransportOffer,
    rForm: FormGroup,
    fb: FormBuilder,
    isDestroyed$: Subject<boolean>
  ) {
    let creationInfo = <FormGroup>rForm.get("creationInfo");

    this.patchCreationInfo(tr.creationInfo, creationInfo);

    tr.load.date = this.momentService.setFormatedDateTime(tr.load.date);
    tr.unload.date = this.momentService.setFormatedDateTime(tr.unload.date);

    this.contractorService.patchCompanyData(
      tr.tradeInfo.company,
      <FormGroup>rForm.get("tradeInfo.company"),
      fb,
      false
    );
    this.patchTradeInfo(tr.tradeInfo, <FormGroup>rForm.get("tradeInfo"), fb);

    rForm.patchValue(tr, { emitEvent: false, onlySelf: true });
  }
}
