import { Injectable } from "@angular/core";
import { ICurrency } from "./interfaces/i-currency";
import { ICurrencyNbp } from "./interfaces/i-currency-nbp";
import { ICurrencyNbpResult } from "./interfaces/i-currency-nbp-result";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Subject, empty, of, Observable, throwError } from "rxjs";
import * as moment from "moment";
import {
  map,
  merge,
  takeUntil,
  take,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
  retry,
  delay,
} from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ICurrencyNbpResultRate } from "app/other-modules/currency/interfaces/i-currency-nbp-result-rate";
import { MomentCommonService } from "../moment-common/services/moment-common.service";

export const CURRENCY_LIST: ICurrency[] = [
  { currencyId: 1, description: "bat (Tajlandia)", name: "THB" },
  { currencyId: 2, description: "lew (Bułgaria)", name: "BGN" },
  { currencyId: 3, description: "lira turecka", name: "TRY" },
  { currencyId: 4, description: "nowy izraelski szekel", name: "ILS" },
  { currencyId: 5, description: "peso chilijskie", name: "CLP" },
  { currencyId: 6, description: "peso filipińskie", name: "PHP" },
  { currencyId: 7, description: "peso meksykańskie", name: "MXN" },
  { currencyId: 8, description: "lej rumuński", name: "RON" },
  {
    currencyId: 9,
    description: "rand (Republika Południowej Afryki)",
    name: "ZAR",
  },
  { currencyId: 10, description: "ringgit (Malezja)", name: "MYR" },
  { currencyId: 11, description: "rubel rosyjski", name: "RUB" },
  { currencyId: 12, description: "rupia indonezyjska", name: "IDR" },
  { currencyId: 13, description: "rupia indyjska", name: "INR" },
  { currencyId: 14, description: "won południowokoreański", name: "KRW" },
  { currencyId: 15, description: "yuan renminbi (Chiny)", name: "CNY" },
  { currencyId: 16, description: "real (Brazylia)", name: "BRL" },
  { currencyId: 17, description: "kuna (Chorwacja)", name: "HRK" },
  { currencyId: 18, description: "korona szwedzka", name: "SEK" },
  { currencyId: 19, description: "korona norweska", name: "NOK" },
  { currencyId: 20, description: "dolar amerykański", name: "USD" },
  { currencyId: 21, description: "dolar australijski", name: "AUD" },
  { currencyId: 22, description: "dolar Hongkongu", name: "HKD" },
  { currencyId: 23, description: "dolar kanadyjski", name: "CAD" },
  { currencyId: 24, description: "dolar nowozelandzki", name: "NZD" },
  { currencyId: 25, description: "dolar singapurski", name: "SGD" },
  { currencyId: 26, description: "EURO", name: "EUR" },
  { currencyId: 27, description: "forint (Węgry)", name: "HUF" },
  { currencyId: 28, description: "frank szwajcarski", name: "CHF" },
  { currencyId: 29, description: "funt szterling", name: "GBP" },
  { currencyId: 30, description: "hrywna (Ukraina)", name: "UAH" },
  { currencyId: 31, description: "jen (Japonia)", name: "JPY" },
  { currencyId: 32, description: "korona czeska", name: "CZK" },
  { currencyId: 33, description: "korona duńska", name: "DKK" },
  { currencyId: 34, description: "korona islandzka", name: "ISK" },
  { currencyId: 35, description: "SDR (MFW)", name: "XDR" },
  { currencyId: 36, description: "polski złoty", name: "PLN" },
];

@Injectable()
export class CurrencyCommonService {
  constructor(
    private httpClient: HttpClient,
    private mC: MomentCommonService
  ) {}

  findCurrencyByName(name: string): ICurrency {
    name = name.toLowerCase();
    return CURRENCY_LIST.find((f) => f.name.toLowerCase().includes(name));
  }

  getCurrencyListGroup(
    fb: FormBuilder,
    isDestroyed$: Subject<boolean>,
    initCurrencyName?: string
  ): FormControl {
    let res = fb.control({});
    let initCurr = CURRENCY_LIST.find((f) => f.name == initCurrencyName)
      ? CURRENCY_LIST.find((f) => f.name == initCurrencyName)
      : CURRENCY_LIST.find((f) => f.name == "PLN");
    res.setValue(initCurr, { emitEvent: false });
    return res;
  }

  getCurrencyNbpGroup(
    fb: FormBuilder,
    isDestroyed$: Subject<boolean>,
    initCurrencyName?: string
  ): FormGroup {
    let _initCurrencyName = initCurrencyName ? initCurrencyName : "EUR";

    //helper method
    let res = fb.group({
      price: [0, Validators.compose([Validators.required, Validators.min(0)])],
      currency: this.getCurrencyListGroup(fb, isDestroyed$, _initCurrencyName),
      plnValue: [0],
      rate: [0],
      rateDate: [
        this.mC.isCurrencyNbpValidDate(this.mC.getTodayConstTimeMoment()),
      ],
    });

    let rateDate = res.get("rateDate");
    let rate = res.get("rate");
    let plnValue = res.get("plnValue");
    let price = res.get("price");
    let currency = res.get("currency");

    let rateDate$ = rateDate.valueChanges.pipe(takeUntil(isDestroyed$));

    let price$ = price.valueChanges.pipe(
      takeUntil(isDestroyed$),
      debounceTime(1500),
      distinctUntilChanged()
    );

    let currency$ = currency.valueChanges.pipe(takeUntil(isDestroyed$));

    of()
      .pipe(
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
            rateDate: _rateDate,
          };

          if (
            _nbp.price == null ||
            _nbp.price == 0 ||
            _nbp.currency == null ||
            _nbp.rateDate == null
          ) {
            return empty();
          }
          if (_nbp.currency.name == this.findCurrencyByName("pln").name) {
            return of(<ICurrencyNbpResult>{
              rates: [],
            });
          }
          return this.getNbpService$(_nbp);
        })
      )
      .subscribe((_nbpRes: ICurrencyNbpResult) => {
        this.patchCurrencyNbpResult(_nbpRes, res);
        //
        // if currency is PLN patch required rateDate for today...
        //
        res.markAsDirty();
      });
    return res;
  }

  getCurrencyNbp$(_currNBP: ICurrencyNbp): Observable<ICurrencyNbp> {
    return this.getNbpService$(_currNBP).pipe(
      switchMap((_nbpResult: ICurrencyNbpResult) => {
        let rate: ICurrencyNbpResultRate = _nbpResult.rates[0];
        return of(<ICurrencyNbp>{
          currency: _currNBP.currency,
          plnValue: _currNBP.price * rate.mid,
          price: _currNBP.price,
          rate: _nbpResult.rates[0].mid,
          rateDate: this.mC.convertToMoment(rate.effectiveDate),
        });
      })
    );
  }

  getNbpService$(nbp: ICurrencyNbp): Observable<ICurrencyNbpResult> {
    //
    // if nbp service returns not found (weekend day/ holiday etc.. )
    // request rateDate (a day before) (retry 5 times..)
    //
    let dayBefore: number = 0;
    let nbpService$ = (_dayBefore) =>
      this.httpClient
        .get(
          `//api.nbp.pl/api/exchangerates/rates/a/${nbp.currency.name.toLowerCase()}/${this.mC.getFormatedDate(
            nbp.rateDate.subtract(_dayBefore, "days")
          )}`
        )
        .pipe(
          map((_res) => <ICurrencyNbpResult>_res),
          take(1)
        );

    return nbpService$(0).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status == 404) {
            dayBefore = dayBefore + 1;
            return nbpService$(dayBefore).pipe(
              delay(1000),
              catchError((err) => throwError("błąd i tyle"))
            );
          }
        }
        throwError("Nieznany błąd servera NBP");
      }),
      retry(5)
    );
  }

  patchCurrencyList(data: ICurrency, rForm: FormControl) {
    rForm.setValue(data ? data : this.findCurrencyByName("pln"), {
      emitEvent: false,
    });
    rForm.markAsDirty();
  }

  patchCurrencyNbp(data: ICurrencyNbp, rForm: FormGroup) {
    let d = moment.isMoment(data.rateDate);
    data.rateDate = moment.isMoment(data.rateDate)
      ? data.rateDate
      : moment(data.rateDate);
    let currency = <FormControl>rForm.get("currency");
    this.patchCurrencyList(data.currency, currency);
    rForm.setValue(data, { emitEvent: false });
    rForm.markAsDirty();
  }

  patchCurrencyNbpResult(_nbpRes: ICurrencyNbpResult, rForm: FormGroup): void {
    let isNbpResRates = _nbpRes.rates.length > 0;
    let _rate = isNbpResRates ? _nbpRes.rates[0].mid : 0;

    let _rFormPrice = <FormControl>rForm.get("price");
    let _rFormPlnValue = <FormControl>rForm.get("plnValue");
    let _rFormRate = <FormControl>rForm.get("rate");
    let _rFormRateDate = <FormControl>rForm.get("rateDate");

    let _plnValue = isNbpResRates
      ? Math.round(_rate * _rFormPrice.value * 100) / 100
      : _rFormPrice.value;
    let _rateDate = isNbpResRates
      ? moment(_nbpRes.rates[0].effectiveDate)
      : this.mC.getToday();

    _rFormPlnValue.setValue(_plnValue, { emitEvent: false });
    _rFormRate.setValue(_rate, { emitEvent: false });
    _rFormRateDate.setValue(_rateDate, { emitEvent: false });

    rForm.markAsDirty();
  }
}
