import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { environment } from "environments/environment";
import { TokenService } from "app/services/token.service";
import { catchError, take, takeUntil } from "rxjs/operators";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { Subject } from "rxjs";
import { ITransportOffer } from "../interfaces/itransport-offer";
import { ICreationInfo } from "@bpCommonInterfaces/i-creation-info";
import { ICurrencyNbp } from "app/other-modules/currency/interfaces/i-currency-nbp";
import { ILoadTradeInfo } from "@bpCommonInterfaces/iload";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";

@Injectable()
export class TransportService extends DataFactoryService {
  constructor(
    private dateTimeService: DateTimeCommonServiceService,
    public http: HttpClient,
    private token: TokenService,
    private contractorService: ContractorService,
    private currencyService: CurrencyCommonService,

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
      date: [this.dateTimeService.getToday(), Validators.required],
      price: this.currencyService.getCurrencyNbpGroup(fb),
      paymentTerms: this.pTermsService.getPaymentTermsGroup$(),
    });

    res
      .get("date")
      .valueChanges.pipe(takeUntil(isDestroyed$))
      .subscribe((s: Date) => {
        let _day0 = res.get("paymentTerms.day0") as FormControl;
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
    info.createdDateTime = new Date(info.createdDateTime).toISOString();
    info.modifyDateTime = new Date(info.modifyDateTime).toISOString();
    rForm.patchValue(info, { emitEvent: false });
  }

  patchTradeInfo(info: ILoadTradeInfo, rForm: FormGroup, fb: FormBuilder) {
    //rForm - formLoadTradeInfoGroup
    //patching companyData
    // info.date = this.momentService.convertToConstTime(info.date);
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
    // this.pTermsService.patchPaymentTerms(
    //   info.paymentTerms,
    //   <FormGroup>rForm.get("paymentTerms")
    // );
    rForm.patchValue(info, { emitEvent: false, onlySelf: true });
  }

  patchTransport(
    transportData: ITransportOffer,
    rForm: FormGroup,
    fb: FormBuilder
  ) {
    let creationInfo = <FormGroup>rForm.get("creationInfo");

    this.patchCreationInfo(transportData.creationInfo, creationInfo);

    /**
     * native dateTime input format is similar to ISO format (except - last letter)
     *
     */
    transportData.load.date = transportData.load.date.slice(0, -1);
    transportData.unload.date = transportData.unload.date.slice(0, -1);

    this.contractorService.patchCompanyData(
      transportData.tradeInfo.company,
      <FormGroup>rForm.get("tradeInfo.company"),
      fb,
      false
    );
    this.patchTradeInfo(
      transportData.tradeInfo,
      <FormGroup>rForm.get("tradeInfo"),
      fb
    );

    rForm.patchValue(transportData, { emitEvent: false });
  }
}
