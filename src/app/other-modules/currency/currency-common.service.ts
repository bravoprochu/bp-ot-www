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
  retryWhen,
  delay,
  takeWhile,
  finalize,
  tap,
} from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ICurrencyNbpResultRate } from "app/other-modules/currency/interfaces/i-currency-nbp-result-rate";
import { INbpTableCurrencyDateRateResponse } from "./interfaces/i-nbp-table-currency-date-rate-response";
import { DateTime } from "luxon";
import { DateTimeCommonServiceService } from "../date-time-common/services/date-time-common-service.service";
import { CHECK_IF_CURRENCY_NOT_PLN_VALIDATOR } from "./form-validators/check-if-currency-pln";

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
    private dateTimeCommonService: DateTimeCommonServiceService,
    private httpClient: HttpClient
  ) {}

  findCurrencyByName(name: string): ICurrency {
    return CURRENCY_LIST.find((f) =>
      f.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  formatTwoDigits(num: number): string {
    const formatter = new Intl.NumberFormat("pl-PL", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    return formatter.format(num);
  }

  getCurrencyListGroup(fb: FormBuilder, initCurrencyName = "PLN"): FormControl {
    const RES = fb.control({});
    const INIT_CURR = CURRENCY_LIST.find((f) => f.name == initCurrencyName);
    RES.setValue(INIT_CURR, { emitEvent: false });
    return RES;
  }

  getCurrencyNbpGroup(fb: FormBuilder, initCurrencyName = "EUR"): FormGroup {
    const res = fb.group({
      price: [
        null,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      currency: this.getCurrencyListGroup(fb, initCurrencyName),
      plnValue: [],
      rate: [0],
      rateDate: [new Date()],
      table: [null],
      no: [null],
    });

    res.setValidators([CHECK_IF_CURRENCY_NOT_PLN_VALIDATOR()]);

    return res;
  }

  getExchangeFromNbpService$(nbp: ICurrencyNbp): Observable<ICurrencyNbp> {
    //
    // if nbp service returns not found (weekend day/ holiday etc.. )
    // request rateDate (a day before) (retry max 5 times..)
    //
    const NBP_BASE_URL = `http://api.nbp.pl/api/exchangerates/rates/a`;
    const CURRENCY = nbp.currency.name.toLowerCase();
    let DATE_TO_CHECK = this.dateTimeCommonService.formatYYYYMMDD(nbp.rateDate);

    const URL_FN = (DATE: string) =>
      encodeURI(`${NBP_BASE_URL}/${CURRENCY}/${DATE}`);

    const GET_NBP = (urlRateDate: string) =>
      this.httpClient.get<ICurrencyNbpResult>(urlRateDate).pipe(
        take(1),
        catchError((error: HttpErrorResponse, caught) => {
          if (error.error) {
          }
          return throwError(error);
        })
      );

    return GET_NBP(URL_FN(DATE_TO_CHECK)).pipe(
      catchError((err: any) => {
        DATE_TO_CHECK = this.dateTimeCommonService.addDaysToYYYMMDD(
          DATE_TO_CHECK,
          -1
        );
        return GET_NBP(URL_FN(DATE_TO_CHECK));
      }),
      retry(5),
      map((nbpRes: ICurrencyNbpResult) => {
        const RATE = nbpRes.rates[0];

        const RES = {
          currency: nbp.currency,
          plnValue: this.formatTwoDigits(nbp.price * RATE.mid),
          price: nbp.price,
          rate: RATE.mid,
          rateDate: RATE.effectiveDate,
          no: RATE.no,
          table: "A",
        } as ICurrencyNbp;
        return RES;
      })
    );
  }

  patchCurrencyList(data: ICurrency, rForm: FormControl) {
    rForm.setValue(data ? data : this.findCurrencyByName("pln"), {
      emitEvent: false,
    });
    rForm.markAsDirty();
  }

  patchCurrencyNbp(data: ICurrencyNbp, rForm: FormGroup) {
    let currency = <FormControl>rForm.get("currency");
    this.patchCurrencyList(data.currency, currency);
    rForm.patchValue(data, { emitEvent: false });
    rForm.markAsDirty();
  }

  prepCombinedInfoNbp(currNBPRes: ICurrencyNbp): string {
    return `Średni kurs dla ${currNBPRes.currency.description} (${currNBPRes.currency.name}) z dnia ${currNBPRes.rateDate} wynosi: ${currNBPRes.rate} (tabela: ${currNBPRes.no})`;
  }
}
