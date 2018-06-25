import { Injectable } from '@angular/core';
import { ICurrency } from './interfaces/i-currency';
import { ICurrencyNbp } from './interfaces/i-currency-nbp';
import { ICurrencyNbpResult } from './interfaces/i-currency-nbp-result';
import { FormGroup, FormBuilder, FormControlDirective, FormControl, Validators } from '@angular/forms';
import { Subject, empty, of, observable, Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { map, merge, takeUntil, tap, take, switchMap, debounceTime, distinctUntilChanged, catchError, repeat, retry, delay } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { ICurrencyNbpResultRate } from '@bpShared/currency/interfaces/i-currency-nbp-result-rate';
import { DEFAULT_APP_VALUES } from 'environments/environment.prod';



export const CURRENCY_LIST: ICurrency[] = [
  { "currencyId": 1, "description": "bat (Tajlandia)", "name": "THB" }, { "currencyId": 2, "description": "lew (Bułgaria)", "name": "BGN" }, { "currencyId": 3, "description": "lira turecka", "name": "TRY" }, { "currencyId": 4, "description": "nowy izraelski szekel", "name": "ILS" }, { "currencyId": 5, "description": "peso chilijskie", "name": "CLP" }, { "currencyId": 6, "description": "peso filipińskie", "name": "PHP" }, { "currencyId": 7, "description": "peso meksykańskie", "name": "MXN" }, { "currencyId": 8, "description": "lej rumuński", "name": "RON" }, { "currencyId": 9, "description": "rand (Republika Południowej Afryki)", "name": "ZAR" }, { "currencyId": 10, "description": "ringgit (Malezja)", "name": "MYR" }, { "currencyId": 11, "description": "rubel rosyjski", "name": "RUB" }, { "currencyId": 12, "description": "rupia indonezyjska", "name": "IDR" }, { "currencyId": 13, "description": "rupia indyjska", "name": "INR" }, { "currencyId": 14, "description": "won południowokoreański", "name": "KRW" }, { "currencyId": 15, "description": "yuan renminbi (Chiny)", "name": "CNY" }, { "currencyId": 16, "description": "real (Brazylia)", "name": "BRL" }, { "currencyId": 17, "description": "kuna (Chorwacja)", "name": "HRK" }, { "currencyId": 18, "description": "korona szwedzka", "name": "SEK" }, { "currencyId": 19, "description": "korona norweska", "name": "NOK" }, { "currencyId": 20, "description": "dolar amerykański", "name": "USD" }, { "currencyId": 21, "description": "dolar australijski", "name": "AUD" }, { "currencyId": 22, "description": "dolar Hongkongu", "name": "HKD" }, { "currencyId": 23, "description": "dolar kanadyjski", "name": "CAD" }, { "currencyId": 24, "description": "dolar nowozelandzki", "name": "NZD" }, { "currencyId": 25, "description": "dolar singapurski", "name": "SGD" }, { "currencyId": 26, "description": "EURO", "name": "EUR" }, { "currencyId": 27, "description": "forint (Węgry)", "name": "HUF" }, { "currencyId": 28, "description": "frank szwajcarski", "name": "CHF" }, { "currencyId": 29, "description": "funt szterling", "name": "GBP" }, { "currencyId": 30, "description": "hrywna (Ukraina)", "name": "UAH" }, { "currencyId": 31, "description": "jen (Japonia)", "name": "JPY" }, { "currencyId": 32, "description": "korona czeska", "name": "CZK" }, { "currencyId": 33, "description": "korona duńska", "name": "DKK" }, { "currencyId": 34, "description": "korona islandzka", "name": "ISK" }, { "currencyId": 35, "description": "SDR (MFW)", "name": "XDR" }, { "currencyId": 36, "description": "polski złoty", "name": "PLN" }
];


@Injectable()
export class CurrencyCommonService {

  constructor(
    private httpClient: HttpClient,
    private mC: MomentCommonService
  ) { }


  findCurrencyByName(name: string): ICurrency {
    name = name.toLowerCase();
    return CURRENCY_LIST.find(f => f.name.toLowerCase().includes(name));
  }

  getCurrencyListGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>, initCurrencyName?: string): FormControl {
    //    initCurrencyName = initCurrencyName ? initCurrencyName : "PLN";
    let res = fb.control({});
    let initCurr = CURRENCY_LIST.find(f => f.name == initCurrencyName) ? CURRENCY_LIST.find(f => f.name == initCurrencyName) : CURRENCY_LIST.find(f => f.name == "PLN")
    res.patchValue(initCurr, { emitEvent: false });
    return res;
  }


  getCurrencyNbpGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>, initCurrencyName?: string): FormGroup {
    initCurrencyName = initCurrencyName ? initCurrencyName : "EUR";

    //helper method
    let res = fb.group({
      "price": [0, Validators.compose([Validators.required, Validators.min(0)])],
      "currency": this.getCurrencyListGroup(fb, isDestroyed$, initCurrencyName),
      "plnValue": [null],
      "rate": [0],
      "rateDate": [this.mC.isCurrencyNbpValidDate(this.mC.getTodayConstTimeMoment())]
    });

    let rateDate = res.get('rateDate');
    let rate = res.get('rate');
    let plnValue = res.get('plnValue');
    let price = res.get('price');
    let currency = res.get('currency');

    // plnValue.disable();
    // rate.disable();

    let rateDate$ = rateDate.valueChanges.pipe(
      takeUntil(isDestroyed$),
      map((_date: moment.Moment) => {
        if (_date instanceof moment) {
          rateDate.setValue(this.mC.isCurrencyNbpValidDate(_date), { emitEvent: false });
        }
        return _date;
      }),
    );

    let price$ = price.valueChanges.pipe(
      takeUntil(isDestroyed$),
      debounceTime(1500),
      distinctUntilChanged(),
    );

    let currency$ = currency.valueChanges.pipe(
      takeUntil(isDestroyed$),
    );



    of().pipe(
      takeUntil(isDestroyed$),
      merge(rateDate$, price$, currency$),
      switchMap((value: any) => {
        let _rateDate = rateDate.value;
        if (!moment(_rateDate).isValid()) {
          _rateDate = moment();
        }
        let _nbp: ICurrencyNbp = <ICurrencyNbp>{
          currency: currency.value,
          price: price.value,
          rateDate: _rateDate
        }
        return this.getNbpRate$(_nbp);
      }),
    )
      .subscribe(
        (_nbpRes: ICurrencyNbpResult) => {
          this.patchCurrencyNbpResult(_nbpRes, res);
          res.markAsDirty();
        },
    );
    return res;
  }


  getNbpRate$(nbp: ICurrencyNbp): Observable<ICurrencyNbpResult> {
    if (nbp.price == null ||
      nbp.price == 0 ||
      nbp.currency == null ||
      nbp.rateDate == null
    ) {
      return empty();
    }

    if (nbp.currency.name == this.findCurrencyByName("pln").name) {

      return of(<ICurrencyNbpResult>{
        rates: []
      });
    }


    //
    // if nbp service returns not found (weekend day/ holiday etc.. ) 
    // request rateDate (a day before) (retry 5 times..)
    //

    let dayBefore: number = 0

    let nbpService$ = (_dayBefore) => this.httpClient.get(`//api.nbp.pl/api/exchangerates/rates/a/${nbp.currency.name.toLowerCase()}/${this.mC.getFormatedDate(nbp.rateDate.subtract(_dayBefore, "days"))}`)
      .pipe(
        map(_res => <ICurrencyNbpResult>_res),
        take(1)
      );

    return nbpService$(0)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status == 404) {
              dayBefore = dayBefore + 1;
              return nbpService$(dayBefore).pipe(
                delay(1000),
                catchError(err => throwError("błąd i tyle"))
              );
            }
          }
          throwError("Nieznany błąd servera NBP");
        }),
        retry(5)
      );
  }



  patchCurrencyList(data: ICurrency, rForm: FormControl) {
    rForm.setValue(data, { emitEvent: true });
  }


  patchCurrencyNbp(data: ICurrencyNbp, rForm: FormGroup) {

    data.rateDate = moment.isMoment(data.rateDate) ? data.rateDate : moment(data.rateDate);
    // rForm.patchValue(data, {emitEvent: false});
    let currency = <FormControl>rForm.get('currency');
    this.patchCurrencyList(data.currency, currency);
    rForm.setValue(data, { emitEvent: false });
  }


  patchCurrencyNbpResult(_nbpRes: ICurrencyNbpResult, rForm: FormGroup): void {
    console.log('patchCurrencyNbpResult', rForm.value);
    let isNbpResRates = _nbpRes.rates.length > 0;
    let _rate = isNbpResRates ? _nbpRes.rates[0].mid : 0;

    let _rFormPrice = <FormControl>rForm.get("price");
    let _rFormPlnValue = <FormControl>rForm.get("plnValue");
    let _rFormRate = <FormControl>rForm.get("rate");
    let _rFormRateDate = <FormControl>rForm.get("rateDate");

    let _plnValue = isNbpResRates ? Math.round((_rate * _rFormPrice.value) * 100) / 100 : _rFormPrice.value;

    let _rateDate = isNbpResRates ? moment(_nbpRes.rates[0].effectiveDate) : null;

    _rFormPlnValue.setValue(_plnValue, { emitEvent: false });
    _rFormRate.setValue(_rate, { emitEvent: false });
    _rFormRateDate.setValue(_rateDate, { emitEvent: false });

    rForm.markAsDirty();
  }
}
