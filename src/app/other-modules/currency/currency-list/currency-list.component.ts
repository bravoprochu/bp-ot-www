import { Component, OnInit, Input, ViewChild, OnDestroy } from "@angular/core";
import { ICurrency } from "../interfaces/i-currency";
import {
  CURRENCY_LIST,
  CurrencyCommonService,
} from "../currency-common.service";
import { FormControl, Validators } from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-currency-list",
  templateUrl: "./currency-list.component.html",
  styleUrls: ["./currency-list.component.css"],
})
export class CurrencyListComponent implements OnInit, OnDestroy {
  @Input() rForm: FormControl;
  @ViewChild(MatAutocomplete) matAuto: MatAutocomplete;
  currencyList = [] as ICurrency[];
  isDestroyed$ = new Subject() as Subject<boolean>;
  search$ = new FormControl("", Validators.required) as FormControl;

  constructor(private cf: CurrencyCommonService) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.search$ = new FormControl(this.rForm?.value);
    this.currencyList = CURRENCY_LIST;

    this.rForm?.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((currency: ICurrency) => {
        if (currency) {
          this.search$.setValue(currency, { emitEvent: false });
          this.rForm?.markAsDirty();
        }
      });

    this.search$.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((searchPhrase: string) => {
        if (typeof searchPhrase === "string") {
          searchPhrase = searchPhrase.toLowerCase();
          this.currencyList = CURRENCY_LIST.filter((v: ICurrency) => {
            return (
              v.name.toLowerCase().includes(searchPhrase) ||
              v.description.toLowerCase().includes(searchPhrase)
            );
          });
        } else {
          this.rForm?.setValue(searchPhrase, { emitEvent: true });
        }
      });
  }

  displayWith(curr: ICurrency) {
    return curr ? curr.name : null;
  }
}
