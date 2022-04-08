import { Component, OnInit, Input, ViewChild, OnDestroy } from "@angular/core";
import { ICurrency } from "../interfaces/i-currency";
import {
  CURRENCY_LIST,
  CurrencyCommonService,
} from "../currency-common.service";
import {
  ControlContainer,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocomplete } from "@angular/material/autocomplete";
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  tap,
} from "rxjs/operators";
import { noop, Subject } from "rxjs";

@Component({
  selector: "app-currency-list",
  templateUrl: "./currency-list.component.html",
  styleUrls: ["./currency-list.component.css"],
})
export class CurrencyListComponent implements OnInit, OnDestroy {
  @Input() controlContainerParentRef = [] as string[];
  @Input() controlContainerRef = "currency";

  @Input() set formData(currency: ICurrency) {
    this.initForm();
    this.prepInitIncomingData(currency);
    this.searchPhrase$.setValue(currency);
  }

  currencyList = CURRENCY_LIST;

  searchPhrase$ = new FormControl("", Validators.required) as FormControl;
  reactiveForm = new FormControl();

  private isDestroyed$ = new Subject<void>();

  constructor(private controlContainer: ControlContainer) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next();
    this.isDestroyed$.complete();
  }

  ngOnInit() {
    this.searchPhrase$.valueChanges
      .pipe(
        tap(() => {
          this.reactiveForm.setValue(null);
          this.reactiveForm.markAsDirty();
          this.searchPhrase$.setValidators(Validators.required);
          this.searchPhrase$.setErrors({ required: true });
        }),
        tap((searchPhrase: string) => {
          this.reactiveForm.setValue(null);
          this.reactiveForm.markAsDirty();

          if (typeof searchPhrase === "string") {
            searchPhrase = searchPhrase.toLowerCase();
            this.currencyList = CURRENCY_LIST.filter((currency: ICurrency) => {
              return (
                currency.name.toLowerCase().includes(searchPhrase) ||
                currency.description.toLowerCase().includes(searchPhrase)
              );
            });
          } else {
            this.reactiveForm.setValue(searchPhrase);
            this.searchPhrase$.clearValidators();
            this.searchPhrase$.updateValueAndValidity({ emitEvent: false });
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(noop);
  }

  displayWith(currency: ICurrency) {
    return currency ? currency.name : null;
  }

  private initForm(): void {
    let parent: FormGroup;
    if (this.controlContainerParentRef.length === 0) {
      parent = this.controlContainer.control as FormGroup;
    } else {
      parent = this.controlContainer.control.get(
        this.controlContainerParentRef
      ) as FormGroup;
    }
    const reactiveForm = new FormControl(
      "",
      Validators.required
    ) as FormControl;

    parent.setControl(this.controlContainerRef, reactiveForm);

    this.reactiveForm = this.controlContainer.control.get([
      ...this.controlContainerParentRef,
      this.controlContainerRef,
    ]) as FormControl;
  }

  private prepInitIncomingData(currency: ICurrency): void {
    this.reactiveForm.patchValue(currency);
  }
}
