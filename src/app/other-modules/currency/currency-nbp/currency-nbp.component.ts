import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { combineLatest, empty, Observable, Subject } from "rxjs";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { ICurrencyNbpResult } from "../interfaces/i-currency-nbp-result";
import { ICurrencyNbp } from "../interfaces/i-currency-nbp";
import { ICurrency } from "../interfaces/i-currency";

@Component({
  selector: "app-currency-nbp",
  templateUrl: "./currency-nbp.component.html",
  styleUrls: ["./currency-nbp.component.css"],
})
export class CurrencyNbpComponent implements OnInit, OnDestroy {
  combinedInfo$?: Observable<string>;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  currentNbpResult = {} as ICurrencyNbpResult;
  @Input() rForm = this.currencyCommonService.getCurrencyNbpGroup(this.fb);
  @Input() placeholder = "Wartość";
  maxDate = new Date();
  refreshData$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private currencyCommonService: CurrencyCommonService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
  }

  ngOnInit() {
    this.initObservables();
  }

  initObservables(): void {
    const PRICE = this.price.valueChanges.pipe(
      startWith(this.price.value),
      debounceTime(750),
      distinctUntilChanged()
    );
    const DATE = this.rateDate.valueChanges.pipe(
      startWith(this.rateDate.value)
    );
    const CURRENCY = this.currency.valueChanges.pipe(
      startWith(this.currency.value)
    );

    const NBP_RESPONSE$ = combineLatest([
      PRICE,
      DATE,
      CURRENCY,
      // this.refreshData$,
    ]).pipe(
      tap(() => this.rForm.updateValueAndValidity()),
      switchMap(() => {
        if (this.rForm.valid && !this.isCurrencyPLN()) {
          return this.currencyCommonService.getExchangeFromNbpService$(
            this.rForm.value
          );
        }
        return empty();
      })
    );

    this.combinedInfo$ = NBP_RESPONSE$.pipe(
      map((currNBPRes: ICurrencyNbp) => {
        this.currencyCommonService.patchCurrencyNbp(currNBPRes, this.rForm);
        return this.currencyCommonService.prepCombinedInfoNbp(currNBPRes);
      })
    );
  }

  private isCurrencyPLN(): boolean {
    return (this.currency.value as ICurrency).name === "PLN";
  }

  //#region rForm getters

  get currency(): FormControl {
    return <FormControl>this.rForm?.get("currency");
  }
  get plnValue(): FormControl {
    return <FormControl>this.rForm?.get("plnValueFormated");
  }

  get price(): FormControl {
    return <FormControl>this.rForm?.get("price");
  }
  get rate(): FormControl {
    return <FormControl>this.rForm?.get("rate");
  }

  get rateDate(): FormControl {
    return <FormControl>this.rForm?.get("rateDate");
  }
  //#endregion
}
