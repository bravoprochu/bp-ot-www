import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ICreationInfo } from 'app/shared/interfaces/i-creation-info';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { ICompany } from 'app/shared/interfaces/icompany';
import { IStatusCode } from 'app/shared/interfaces/istatus-code';
import * as moment from 'moment';
import { IErrorObj } from '../shared/interfaces/ierror-object';
import { ILoad, ILoadInfo, ILoadInfoExtra, ILoadTradeInfo } from '../shared/interfaces/iload';
import { IValueViewValue, IViewValueGroupName } from '../shared/interfaces/ivalue-view-value';
import { ITransportOffer } from '../ui/transport/interfaces/itransport-offer';
import { Subject } from 'rxjs';
import { PaymentTermsService } from '@bpShared/payment-terms/payment-terms.service';
import { CurrencyCommonService } from '@bpShared/currency/currency-common.service';
import { ICurrencyNbp } from '@bpShared/currency/interfaces/i-currency-nbp';
import { Moment } from 'moment';
import { IPaymentTerm } from '@bpShared/payment-terms/i-payment-term';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { IInvoiceExtraInfoChecked, IInvoiceExtraInfo } from '@bpUI/invoice/interfaces/iinvoice-sell';
import { isArray } from 'util';


@Injectable()
export class CommonFunctionsService {

  constructor(
    private snackBar: MatSnackBar,
    private pTermsService: PaymentTermsService,
    private currService: CurrencyCommonService,
    public momentService: MomentCommonService,
  ) {
    this.logArr = [];
  }


  dataTablePrepColumn(data: any[]): string[]{
    let result: string[] = [];
    if (data ==null) {return;}
    if (data.length==0) {return;}
    let first = data[0];
    for (let prop in first) {
      result.push(prop)
    };
    return result;
  }


  csvConverter(data: any[], tableHeaders: string[]): string {
    if (isArray(data) && data.length > 1) {

      let firstLine: string = "";
      let end = ";";
      let lineEnd = "\r\n";
      let result: string = "";

      //
      // header
      //

      firstLine = tableHeaders.join(end) + lineEnd;

      // for (let key in data[0]) {
      //   firstLine += key + end;
      // }
      // firstLine += lineEnd;

      //
      // loop
      //

      data.forEach(row=>{
        tableHeaders.forEach(header=>{
          let v:string;
          if(row[header]==null) {
            v="";
          } else {
            v=row[header];
          }
          result+=v+end
        });
        result+=lineEnd;
      });

      // for (let index = 0; index < data.length; index++) {
      //   const element = data[index];

      //   for (let key in element) {
      //     let v = element[key];
      //     //
      //     // check if number.. parse..
      //     //

      //     if (v != null) {

      //       // if (this.momentService.isDate(v)) {
      //       //   result += moment(v).format(this.dateTimeLocaleFormat()) + end;
      //       // } else  {
              
      //       // }
      //     result += v +end;

      //     } else {
      //       result += "" + end;
      //     }
      //   }

      //   result += lineEnd;
      // }

      return firstLine + result;
    }
    return
  }



  logArr: ILogItem[];
  compareWithValueViewValue(obj1: IValueViewValue, obj2: IValueViewValue): boolean {
    if (obj1 == null || obj2 == null) { return false }
    return obj1.viewValueDictionaryId == obj2.viewValueDictionaryId;
  }

  dateLocaleFormat(): string {
    return "YYYY-MM-DD";
  }

  dateTimeLocaleFormat(): string {
    return "YYYY-MM-DDTHH:mm";
  }

  getNextHour(hoursToAdd: number = 1) {
    return moment().add(hoursToAdd, 'hours').minutes(0).format(this.dateTimeLocaleFormat());
  }


  getViewValueGroupName(): IViewValueGroupName[] {
    return [{ "viewValueGroupNameId": 1, "name": "waysOfLoad", "description": "waysOfLoad" }, { "viewValueGroupNameId": 2, "name": "addrClasses", "description": "addrClasses" }, { "viewValueGroupNameId": 3, "name": "truckBody", "description": "truckBody" }, { "viewValueGroupNameId": 4, "name": "typeOfLoad", "description": "typeOfLoad" }, { "viewValueGroupNameId": 5, "name": "loadRoutePalletType", "description": "loadRoutePalletType" }];
  }

  getViewValueDictionary(): IValueViewValue[] {
    return [{ "viewValueDictionaryId": 47, "value": "back", "viewValue": "tyłem", "viewValueGroupNameId": 1 }, { "viewValueDictionaryId": 45, "value": "top", "viewValue": "góra", "viewValueGroupNameId": 1 }, { "viewValueDictionaryId": 61, "value": "side", "viewValue": "bokiem", "viewValueGroupNameId": 1 }, { "viewValueDictionaryId": 33, "value": "2", "viewValue": "Gazy", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 34, "value": "3", "viewValue": "Materiały ciekłe zapalne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 35, "value": "4.1", "viewValue": "Materiały stałe zapalne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 36, "value": "4.2", "viewValue": "Materiały samozapalne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 37, "value": "4.3", "viewValue": "Materiały wytwarzające w zetknięciu z wodą gazy palne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 38, "value": "5.1", "viewValue": "Materiały utleniające", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 39, "value": "5.2", "viewValue": "Nadtlenki organiczne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 40, "value": "6.1", "viewValue": "Materiały trujące", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 41, "value": "6.2", "viewValue": "Materiały zakaźne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 42, "value": "7", "viewValue": "Materiały promieniotwórcze", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 43, "value": "8", "viewValue": "Materiały żrące", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 44, "value": "9", "viewValue": "Różne materiały i przedmioty niebezpieczne", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 1, "value": "1", "viewValue": "Materiały i przedmioty wybuchowe", "viewValueGroupNameId": 2 }, { "viewValueDictionaryId": 2, "value": "log-trailer", "viewValue": "dłużyca", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 3, "value": "oversized-cargo", "viewValue": "ponadgabaryt", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 4, "value": "hook-lift", "viewValue": "hakowiec", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 5, "value": "container-20-40", "viewValue": "kontener 20/40", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 6, "value": "dump-truck", "viewValue": "wywrotka", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 7, "value": "koffer", "viewValue": "koffer (stała zabudowa)", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 8, "value": "swap-body-system", "viewValue": "wymienne podwozie", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 9, "value": "jumbo", "viewValue": "jumbo", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 10, "value": "cooler", "viewValue": "chłodnia", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 11, "value": "curtainsider", "viewValue": "firanka", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 12, "value": "tanker", "viewValue": "cysterna", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 13, "value": "silos", "viewValue": "silos", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 14, "value": "removal-truck", "viewValue": "meblowóz", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 48, "value": "tent", "viewValue": "plandeka", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 49, "value": "isotherm", "viewValue": "izoterma", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 50, "value": "box-truck", "viewValue": "kontener", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 51, "value": "spacious", "viewValue": "przestrzenne", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 52, "value": "other", "viewValue": "inne", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 53, "value": "car-transporter", "viewValue": "laweta", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 54, "value": "double-trailer", "viewValue": "zestaw", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 55, "value": "van", "viewValue": "van/bus", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 56, "value": "mega", "viewValue": "mega", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 57, "value": "coilmulde", "viewValue": "colimulde", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 58, "value": "walking-floor", "viewValue": "ruchoma podłoga", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 59, "value": "low-suspension", "viewValue": "niskopodwoziowe", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 60, "value": "flatbed", "viewValue": "platforma", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 29, "value": "gas-tanker", "viewValue": "cysterna gazowa", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 30, "value": "petroleum-tanker", "viewValue": "cysterna paliwowa", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 31, "value": "food-tanker", "viewValue": "cysterna spożywcza", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 32, "value": "chemical-tanker", "viewValue": "cysterna chemiczna", "viewValueGroupNameId": 3 }, { "viewValueDictionaryId": 15, "value": "full-truck-standard", "viewValue": "całopojazdowy - firana Standard", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 16, "value": "full-truck-mega", "viewValue": "całopojazdowy - firana Mega", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 17, "value": "cubic", "viewValue": "objętościowy", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 18, "value": "bag", "viewValue": "worek", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 19, "value": "item", "viewValue": "sztuka towaru (bez specyfikacji)", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 20, "value": "envelope", "viewValue": "koperta", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 21, "value": "box", "viewValue": "skrzynia", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 22, "value": "package", "viewValue": "paczka", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 23, "value": "cardboard", "viewValue": "karton", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 24, "value": "timber", "viewValue": "dłużyca", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 25, "value": "roll", "viewValue": "rolka", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 26, "value": "roll2", "viewValue": "rulon", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 27, "value": "barrel", "viewValue": "beczka", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 28, "value": "other", "viewValue": "inne", "viewValueGroupNameId": 4 }, { "viewValueDictionaryId": 62, "value": "other", "viewValue": "Inne", "viewValueGroupNameId": 5 }, { "viewValueDictionaryId": 46, "value": "euro", "viewValue": "EURO", "viewValueGroupNameId": 5 }];
  }



  //=================================================================================================================

  getViewValueLoadWaysOfLoad(): IValueViewValue[] {
    let groupName = "waysOfLoad";
    return this.getViewValueDictionary().filter(f => f.viewValueGroupNameId == this.getViewValueGroupName().find(f => f.name == groupName).viewValueGroupNameId);
  }

  getViewValueLoadAddrClasses(): IValueViewValue[] {
    let groupName = "addrClasses";
    return this.getViewValueDictionary().filter(f => f.viewValueGroupNameId == this.getViewValueGroupName().find(f => f.name == groupName).viewValueGroupNameId);
  }
  getViewValueLoadTruckBody(): IValueViewValue[] {
    let groupName = "truckBody";
    return this.getViewValueDictionary().filter(f => f.viewValueGroupNameId == this.getViewValueGroupName().find(f => f.name == groupName).viewValueGroupNameId);
  }
  getViewValueLoadTypeOfLoad(): IValueViewValue[] {
    let groupName = "typeOfLoad";
    return this.getViewValueDictionary().filter(f => f.viewValueGroupNameId == this.getViewValueGroupName().find(f => f.name == groupName).viewValueGroupNameId);
  }

  getViewValueLoadRoutePalletType(): IValueViewValue[] {
    let groupName = "loadRoutePalletType";
    return this.getViewValueDictionary().filter(f => f.viewValueGroupNameId == this.getViewValueGroupName().find(f => f.name == groupName).viewValueGroupNameId);
  }





  httpResponseErrorHandler(resErrors: HttpErrorResponse): IErrorObj[] {
    let res: IErrorObj[] = [];
    let err = resErrors["error"];

    console.log(resErrors);
    if (err["type"] != "error") {
      for (let key in err) {
        let errGroupName = err[key];
        let e = <IErrorObj>{
          errorDescription: key,
          errors: []
        }
        errGroupName.forEach(el => {
          e.errors.push(el);
        });
        res.push(e);
      };
    } else {
      // no errors object
      let e = <IErrorObj>{
        errorDescription: "Error",
        errors: []
      }
      e.errors.push("Inny błąd serwera");
      res.push(e);
    }
    return res;
  }

  //console.log(error);
  //res.errorDescription = resErrors.message;
  //if (resErrors.error == null) return res;
  //if (typeof (resErrors.error) == "object") { res.errors.push("Błąd serwera"); return res }
  // let errors = JSON.parse(resErrors["error"]);

  // for (let key in errors) {
  //   let errGroupName = errors[key];
  //   errGroupName.forEach(err => {
  //     res.errors.push(`${key} | ${err}`);
  //   });
  // }
  // console.log('res', res);





  dateRangeActiveMonth(): IDateRange {
    return <IDateRange>{
      dateStart: moment().date(1),
      dateEnd: moment()
    }
  }

  dateRangeLastQuarter(): IDateRange {
    return <IDateRange>{
      dateStart: moment().subtract(3, "month").date(1),
      dateEnd: moment()
    }
  }



  statusCheck(data: any, code: IStatusCode): IStatusCode {
    //        if(data.status=="undefined" || data.status==null) return data;
    let res: IStatusCode = null;
    switch (code) {
      case IStatusCode.New:
        if (data.status == null || undefined) { res = IStatusCode.New; }
        if (data.status == IStatusCode.Mod) { res = IStatusCode.Mod; }
        if (data.status == IStatusCode.Del) { res = IStatusCode.Base; }
        break;
      case IStatusCode.Mod:
        if (data.status == null || undefined) { res = IStatusCode.New; }
        if (data.status == IStatusCode.Base) { res = IStatusCode.Mod; }
        if (data.status == IStatusCode.Del) { res = IStatusCode.Mod; }
        if (data.status == IStatusCode.Mod) { res = IStatusCode.Mod; }
        if (data.status == IStatusCode.New) { res == IStatusCode.New; }
        break
      case IStatusCode.Del:
        if (data.status == null || undefined) { res = null; }
        if (data.status == IStatusCode.Base) { res = IStatusCode.Del; }
        if (data.status == IStatusCode.Del) { res = IStatusCode.Del; }
        if (data.status == IStatusCode.Mod) { res = IStatusCode.Del; }
        if (data.status == IStatusCode.New) { res = null; }
        break
      default:
        break;
    };
    return res;
  }


  formAddressGroup(form: FormBuilder) {
    return form.group({
      "addressId": [0],
      "address_type": ["główny"],
      "country": [null, Validators.compose([Validators.required, Validators.maxLength(2), Validators.minLength(2)])],
      "postal_code": [null, Validators.required],
      "locality": [null, Validators.required],
      "street_address": [null],
      "street_number": [null, Validators.required],
    });
  }

  formCompanyGroup(fb: FormBuilder) {

    var res = fb.group({
      'addressList': fb.array([]),
      "bankAccountList": fb.array([]),
      'companyId': [null],
      'short_name': [null, Validators.required],
      'legal_name': '',
      'vat_id': [null, Validators.required],
      'telephone': [null],
      'fax': '',
      'email': [null],
      'url': '',
      "employeeList": fb.array([]),
      "trans_id": [null],
    });

    let email = res.get('email');
    let tel = res.get('telephone');

    email
      .valueChanges
      .distinctUntilChanged()
      .subscribe(s => {
        if (s) {
          email.setValidators(Validators.email)
          email.updateValueAndValidity();
        } else {
          email.clearValidators();
          email.updateValueAndValidity();
        }
      })

    return res;
  }

  formCompanyBankAccountGroup(fb: FormBuilder) {
    return fb.group({
      "bankAccountId": [0],
      "type": [null, Validators.required],
      "account_no": [null, Validators.compose([Validators.required, Validators.maxLength(28), Validators.minLength(18)])],
      "swift": []
    });
  }

  formCreationInfo(fb: FormBuilder) {
    return fb.group({
      "createdBy": [null],
      "createdDateTime": [null],
      "modifyBy": [null],
      "modifyDateTime": [null]
    });
  }



  formEmployeeGroup(form: FormBuilder) {
    let res = form.group({
      "companyEmployeeId": [0],
      "given_name": [null, Validators.required],
      "family_name": [null, Validators.required],
      "trans_id": [null],
      "email": [null, Validators.compose([Validators.required, Validators.email])],
      "telephone": [null],
      "is_driver": [false],

    });
    return res;
  }

  formGeoGroup(form: FormBuilder) {
    return form.group({
      "latitude": [null],
      "longitude": [null],
    });
  }






  // formInvoiceSellCorrectionGroup(fb:FormBuilder, isDestroyed$: Subject<boolean>)
  // {
  //   return fb.group({
  //     "invoiceSellCorrectionId": [null],
  //     "baseInvoicesList": fb.array([]),
  //     "invoiceCorrection": this.formInvoiceSellGroup(fb, isDestroyed$),
  //     "invoiceSellCorrectionNo": [null],
  //     "correctionsList": fb.array([])
  //   });
  // }



  formExtraInfoCheckedGroup(fb: FormBuilder) {
    return fb.group({
      'invoiceExtraInfoCheckedId': [],
      'checked': [false],
      'date': [this.momentService.getTodayConstTimeMoment()],
      'info': []
    });
  }






  formLoadGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    return fb.group({
      "buy": this.formLoadBuyGroup(fb, isDestroyed$),
      "creationInfo": this.formCreationInfo(fb),
      //"loadExtraInfo": this.formInvoiceSellExtraInfoGroup(fb),
      "loadExtraInfo": [],
      "invoiceSellNo": [],
      "info": [null],
      "loadNo": [null, Validators.required],
      "loadId": [null, Validators.required],
      "sell": this.formLoadSellGroup(fb, isDestroyed$),
      "transEu": this.formLoadTransEuGroup(fb, isDestroyed$),
    });
  }

  formLoadTransEuGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    return fb.group({
      "loadTransEuId": [null, Validators.required],
      "contactPersonsList": fb.array([]),
      "price": this.currService.getCurrencyNbpGroup(fb, isDestroyed$),
      "sellingCompany": this.formCompanyGroup(fb),
      "transEuId": [null, Validators.required],
    })

  }

  formLoadSellGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    return fb.group({
      "loadSellId": [null],
      "selling_info": this.formTradeInfoGroup(fb, isDestroyed$),
      "principal": this.formCompanyGroup(fb),
      "contactPersonsList": fb.array([])
    })
  }

  formLoadInfo(fb: FormBuilder) {
    return fb.group({
      "description": [null],
      "load_height": [null],
      "load_length": [null],
      "load_volume": [null],
      "load_weight": [null, Validators.required],
      "extraInfo": this.formLoadInfoExtra(fb),
    })
  }

  formLoadInfoExtra(fb: FormBuilder) {
    return fb.group({
      "is_ltl": [null],
      "is_lift_required": [null],
      "is_truck_crane_required": [null],
      "is_tir_cable_required": [null],
      "is_tracking_system_required": [null],
      "is_for_clearence": [null],
      "required_ways_of_loading": [null],
      "required_adr_classes": [null],
      "required_truck_body": [null, Validators.required],
      "type_of_load": [null],
    })
  }


  formLoadBuyGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let buy = fb.group({
      "loadBuyId": [null, Validators.required],
      "buying_info": this.formTradeInfoGroup(fb, isDestroyed$),
      "load_info": this.formLoadInfo(fb),
      "routes": fb.array([]),
    });


    return buy;
  }


  formLoadRouteGroupe(fb: FormBuilder) {
    return fb.group({
      loadRouteId: [],
      loading_date: [null, Validators.required],
      loading_type: [null, Validators.required],
      address: this.formAddressGroup(fb),
      geo: this.formGeoGroup(fb),
      info: [null],
      pallets: fb.array([]),
    });
  }

  formTradeInfoGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>): FormGroup {
    let res = fb.group({
      "company": this.formCompanyGroup(fb),
      "date": [this.momentService.getTodayConstTimeMoment(), Validators.required],
      "price": this.currService.getCurrencyNbpGroup(fb, isDestroyed$),
      "paymentTerms": this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
    });

    res.get("date").valueChanges
      .takeUntil(isDestroyed$)
      .subscribe((s: Moment) => {
        let _day0 = <FormControl>res.get('paymentTerms.day0');
        _day0.setValue(s, { emitEvent: true });
      });
    return res;
  }

  formLoadBuyPallets(form: FormBuilder, isDestroyed$: Subject<boolean>) {
    let palletsTypes = this.getViewValueLoadRoutePalletType();
    let pallet = form.group({
      "loadRoutePalletId": [],
      "type": [this.getViewValueLoadRoutePalletType()[1]],
      "dimmension": [null],
      "amount": [null, Validators.required],
      "is_stackable": [null],
      "is_exchangeable": [null],
      "info": [null]
    });
    pallet.get('type').valueChanges
      .takeUntil(isDestroyed$)
      .subscribe(
        (s) => {
          let dimmensions = pallet.get('dimmension');
          let amount = pallet.get('amount');
          switch (s) {
            case palletsTypes[1].value:
              //EURO
              dimmensions.clearValidators();
              break;
            case palletsTypes[0].value:
              //Inne
              dimmensions.setValidators(Validators.required);
              break;
          }
          dimmensions.updateValueAndValidity();
        });

    return pallet;
  }

  formTransportGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    return fb.group({
      'transportOfferId': [null],
      "creationInfo": this.formCreationInfo(fb),
      'driver': [null],
      'info': [null],
      'invoiceInPLN': [true],
      'invoiceSellId': [null],
      'invoiceSellNo': [null],
      'offerNo': [null, Validators.required],
      'tradeInfo': this.formTradeInfoGroup(fb, isDestroyed$),
      'load': this.formTransportAddressShortGroup(fb),
      'unload': this.formTransportAddressShortGroup(fb)
    })
  }

  formTransportAddressShortGroup(fb: FormBuilder) {
    return fb.group({
      'transportOfferAddressId': [],
      'date': [null, Validators.required],
      'locality': [null, Validators.required],
      'postalCode': [null, Validators.required]
    });
  }





  inWords(numberToConv: number): string {
    // przypisanie obiektu pola tekstowego do zmiennej

    // pobranie liczby
    var liczba = numberToConv;

    var jednosci = ["", " jeden", " dwa", " trzy", " cztery", " pięć", " sześć", " siedem", " osiem", " dziewięć"];
    var nascie = ["", " jedenaście", " dwanaście", " trzynaście", " czternaście", " piętnaście", " szesnaście", " siedemnaście", " osiemnaście", " dziewietnaście"];
    var dziesiatki = ["", " dziesięć", " dwadzieścia", " trzydzieści", " czterdzieści", " pięćdziesiąt", " sześćdziesiąt", " siedemdziesiąt", " osiemdziesiąt", " dziewięćdziesiąt"];
    var setki = ["", " sto", " dwieście", " trzysta", " czterysta", " pięćset", " sześćset", " siedemset", " osiemset", " dziewięćset"];
    var grupy = [
      ["", "", ""],
      [" tysiąc", " tysiące", " tysięcy"],
      [" milion", " miliony", " milionów"],
      [" miliard", " miliardy", " miliardów"],
      [" bilion", " biliony", " bilionów"],
      [" biliard", " biliardy", " biliardów"],
      [" trylion", " tryliony", " trylionów"]];

    if (!isNaN(liczba)) {

      var wynik = '';
      var znak = '';
      if (liczba == 0)
        wynik = "zero";
      if (liczba < 0) {
        znak = "minus";
        liczba = liczba * -1;
      }

      var g = 0;
      while (liczba > 0) {
        var s = Math.floor((liczba % 1000) / 100);
        var n = 0;
        var d = Math.floor((liczba % 100) / 10);
        var j = Math.floor(liczba % 10);
        if (d == 1 && j > 0) {
          n = j;
          d = 0;
          j = 0;
        }

        var k = 2;
        if (j == 1 && s + d + n == 0)
          k = 0;
        if (j == 2 || j == 3 || j == 4)
          k = 1;
        if (s + d + n + j > 0)
          wynik = setki[s] + dziesiatki[d] + nascie[n] + jednosci[j] + grupy[g][k] + wynik;

        g++;
        liczba = Math.floor(liczba / 1000);
      }
    }
    else {
      return "Błędne dane";
    }
    return wynik;
  }

  paginatorLimitOption(length: number): number[] {
    let res: number[] = [];

    if (length > 5) { res.push(5); }
    if (length > 10) { res.push(10); }
    if (length > 25) { res.push(25); }
    if (length > 50) { res.push(50); }
    if (length > 100) { res.push(100); }
    if (res.length == 0 || (res.length > 0 && res[res.length - 1] != length)) { res.push(length); }
    return res;
  }

  paginatorPageSize(length: number): number {
    return length > 10 ? 10 : length;
  }

  paymentTerms(): IPaymentTerm[] {
    return [
      {
        paymentTermId: 1,
        name: 'gotówka',
        isDescription: false,
        isPaymentDate: false,
      },
      {
        paymentTermId: 2,
        name: 'gotówka w terminie',
        isDescription: true,
        isPaymentDate: true,
      },
      {
        paymentTermId: 3,
        name: 'przelew',
        isDescription: false,
        isPaymentDate: true,
      },
      {
        paymentTermId: 4,
        name: 'karta płatnicza',
        isDescription: false,
        isPaymentDate: false,
      }
    ];
  }



  patchCompanyData(companyData: ICompany, rForm: FormGroup, fb: FormBuilder, emit: boolean = true): void {
    let addressList = (<FormArray>rForm.get('addressList'));
    let employeeList = (<FormArray>rForm.get('employeeList'));
    let bankAccountList = (<FormArray>rForm.get('bankAccountList'));
    addressList.controls = [];
    employeeList.controls = [];
    bankAccountList.controls = [];

    companyData.addressList.forEach(adress => {
      let address = <FormGroup>this.formAddressGroup(fb);
      address.markAsDirty();
      addressList.push(address);
    });



    companyData.bankAccountList.forEach(acc => {
      bankAccountList.push(this.formCompanyBankAccountGroup(fb));
    });

    companyData.employeeList.forEach(emp => {
      employeeList.push(this.formEmployeeGroup(fb));
    })
    rForm.patchValue(companyData, { emitEvent: false });

  }

  patchCreationInfo(info: ICreationInfo, rForm: FormGroup) {
    info.createdDateTime = this.setFormatedDateTime(info.createdDateTime);
    info.modifyDateTime = this.setFormatedDateTime(info.modifyDateTime);
    rForm.patchValue(info, { emitEvent: false });
  }


  patchInvoiceExtraInfoChecked(info: IInvoiceExtraInfoChecked, rForm: FormGroup) {
    if (info == null) { return; }
    info.date = this.momentService.convertToConstTime(info.date);
    rForm.patchValue(info, { emitEvent: false });
  }

  patchInvoiceExtraInfo(info: IInvoiceExtraInfo, rForm: FormGroup) {
    this.patchInvoiceExtraInfoChecked(info.cmr, <FormGroup>rForm.get('cmr'));
    this.patchInvoiceExtraInfoChecked(info.recived, <FormGroup>rForm.get('recived'));
    this.patchInvoiceExtraInfoChecked(info.sent, <FormGroup>rForm.get('sent'));
    if (info.currencyNbp.currency) {
      this.currService.patchCurrencyNbp(info.currencyNbp, <FormGroup>rForm.get('currencyNbp'));
    }
    //rForm.patchValue(info, { emitEvent: false, onlySelf: true});
  }





  patchLoad(s: ILoad, rForm: FormGroup, fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    //rForm.patchValue(s, {emitEvent:false, onlySelf: true});
    //rForm=this.formLoadGroup(fb, isDestroyed$);
    //load
    //  s.invoiceSellNo = s.invoiceSellNo ? s.invoiceSellNo : "brak fv";
    //    s.loadExtraInfo = s.loadExtraInfo ? s.loadExtraInfo : <ILoadExtraInfo>{};

    // rForm.get('loadId').setValue(s.loadId);
    // rForm.get('loadNo').setValue(s.loadNo);
    // rForm.get('invoiceSellNo').setValue(s.invoiceSellNo);

    let creationInfo = <FormGroup>rForm.get('creationInfo');

    this.patchCreationInfo(s.creationInfo, creationInfo);

    //buy
    let buy = <FormGroup>rForm.get('buy');
    buy.patchValue(s.buy, { onlySelf: true, emitEvent: false });
    let routes = <FormArray>buy.get('routes');
    routes.controls = [];
    let idx: number = 0; //temp incrementor
    s.buy.routes.forEach(r => {
      //pointing formRoute
      //adding pallets to formRoute
      r.loading_date = this.setFormatedDateTime(r.loading_date);
      routes.push(this.formLoadRouteGroupe(fb));
      let formRoute = <FormArray>routes.at(idx);
      let pallets = <FormArray>formRoute.get('pallets');
      pallets.controls = [];
      r.pallets.forEach(p => {
        pallets.push(this.formLoadBuyPallets(fb, isDestroyed$));
      })
      idx++;
    });
    routes.patchValue(s.buy.routes, { emitEvent: false });
    // buy.get('loadBuyId').setValue(s.buy.loadBuyId);

    this.patchTradeInfo(s.buy.buying_info, <FormGroup>buy.get('buying_info'), fb);
    this.patchLoadInfo(s.buy.load_info, <FormGroup>buy.get('load_info'));

    //invoiceSell
    if (s.loadExtraInfo != null) {
      this.patchInvoiceExtraInfo(s.loadExtraInfo, <FormGroup>rForm.get('loadExtraInfo'));
    }

    //transEu
    if (s.transEu != null) {
      let trans = <FormGroup>rForm.get('transEu');
      trans.patchValue(s.transEu, { onlySelf: true, emitEvent: false });
      //contactsPersonsList
      let contactPersonsList = (<FormArray>trans.get("contactPersonsList"));
      contactPersonsList.controls = [];
      s.transEu.contactPersonsList.forEach(contact => {
        contactPersonsList.push(this.formEmployeeGroup(fb));
      });
      contactPersonsList.patchValue(s.transEu.contactPersonsList, { emitEvent: false });
      // this.patchCurrencyNbpData(s.transEu.price, <FormGroup>trans.get('price'));

      this.patchCompanyData(s.transEu.sellingCompany, <FormGroup>trans.get('sellingCompany'), fb, true);
    }

    //sell
    if (s.sell != null) {
      let sell = <FormGroup>rForm.get('sell');
      sell.patchValue(s.sell, { onlySelf: true, emitEvent: false });
      let contactPersonsList = (<FormArray>sell.get("contactPersonsList"));
      contactPersonsList.controls = [];
      s.sell.contactPersonsList.forEach(contact => {
        contactPersonsList.push(this.formEmployeeGroup(fb));
      });
      contactPersonsList.patchValue(s.sell.contactPersonsList, { emitEvent: false });

      this.patchCompanyData(s.sell.principal, <FormGroup>sell.get('principal'), fb);
      this.patchTradeInfo(s.sell.selling_info, <FormGroup>sell.get('selling_info'), fb);
    }

    //rForm.patchValue(s, { onlySelf: false, emitEvent: true });
    rForm.get('loadNo').patchValue(s.loadNo, { emitEvent: false });
    rForm.get('loadId').patchValue(s.loadId, { emitEvent: false });
    rForm.get('info').patchValue(s.info, { emitEvent: false });


  }

  patchLoadInfo(info: ILoadInfo, rForm: FormGroup) {
    //rForm formLoadInfo
    rForm.patchValue(info, { emitEvent: false, onlySelf: true });
    this.patchLoadInfoExtra(info.extraInfo, <FormGroup>rForm.get('extraInfo'));
  }

  patchLoadInfoExtra(infoExtra: ILoadInfoExtra, rForm: FormGroup) {
    //rForm formLoadInfoExtra
    rForm.patchValue(infoExtra, { emitEvent: false, onlySelf: true });
  }




  patchTradeInfo(info: ILoadTradeInfo, rForm: FormGroup, fb: FormBuilder) {
    //rForm - formLoadTradeInfoGroup
    //patching companyData
    info.date = this.momentService.convertToConstTime(info.date);
    this.patchCompanyData(info.company, <FormGroup>rForm.get('company'), fb);
    //this.patchCurrencyNbpData(info.price, <FormGroup>rForm.get('price'));
    this.currService.patchCurrencyNbp(<ICurrencyNbp>info.price, <FormGroup>rForm.get('price'));
    this.pTermsService.patchPaymentTerms(info.paymentTerms, <FormGroup>rForm.get('paymentTerms'));
    rForm.patchValue(info, { emitEvent: false, onlySelf: true });
  }

  patchTransport(tr: ITransportOffer, rForm: FormGroup, fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let creationInfo = <FormGroup>rForm.get('creationInfo');

    this.patchCreationInfo(tr.creationInfo, creationInfo);

    tr.load.date = this.setFormatedDateTime(tr.load.date);
    tr.unload.date = this.setFormatedDateTime(tr.unload.date);


    // tr.load.date = moment(tr.load.date).utc(false).format(this.dateTimeLocaleFormat());
    // tr.unload.date = moment(tr.unload.date).utc(false).format(this.dateTimeLocaleFormat());


    this.patchCompanyData(tr.tradeInfo.company, <FormGroup>rForm.get('tradeInfo.company'), fb, false);
    this.patchTradeInfo(tr.tradeInfo, <FormGroup>rForm.get('tradeInfo'), fb);

    rForm.patchValue(tr, { emitEvent: false, onlySelf: true });
  }


  roundToCurrency(v: number): number {
    if (isNaN(v) || v == 0) { return 0; }
    return (Math.round(v * 100) / 100);
  }



  setMomentDate(date: any): moment.Moment {
    if (date == null || !moment(date).isValid) { return null; }
    return moment(date);
  }

  setFormatedDateTime(date: any): string {
    if (date == null || !moment(date).isValid) { return null; }
    return moment(date).utc(false).format(this.dateTimeLocaleFormat());
  }

  toastMake(message: string, action: string, actRoute: ActivatedRoute) {
    this.snackBar.open(message, null, {
      duration: 3000,
      horizontalPosition: "end"
    });


    let dataToPush = <ILogItem>{
      action: action,
      message: message,
      routeName: actRoute.snapshot.url.map(m => m.path).join("/")
    }
    //this.logArr.unshift(dataToPush);

  };


  today(): moment.Moment {
    return moment()
  }
}



export interface ILogItem {
  routeName: string,
  message: string,
  action: string
}
