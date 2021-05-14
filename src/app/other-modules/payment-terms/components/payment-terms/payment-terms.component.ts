import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { merge, Observable, of, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { IPaymentTerm } from "../../interfaces/i-payment-term";
import { IPaymentTerms } from "../../interfaces/i-payment-terms";
import { PaymentTermsService } from "../../services/payment-terms.service";

@Component({
  selector: "app-payment-terms",
  templateUrl: "./payment-terms.component.html",
  styleUrls: ["./payment-terms.component.scss"],
  exportAs: "paymentTerms",
})
export class PaymentTermsComponent implements OnInit, OnDestroy {
  @Input() isWeekendAllowed = true;
  isFormReady = true;
  infoPaymentTerms = "";
  @Input() rForm?: FormGroup;
  paymentTermsOptions$ =
    this.paymentTermsService.getPaymentTermOptions$() as Observable<
      IPaymentTerm[]
    >;
  isDestroyed$ = new Subject() as Subject<boolean>;

  constructor(private paymentTermsService: PaymentTermsService) {}
  ngOnInit(): void {
    this.initObservables();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  test(): void {}

  getInitForm(): FormGroup {
    this.rForm = this.paymentTermsService.getPaymentTermsGroup$();
    this.isFormReady = true;
    // this.initObservables();
    return this.rForm;
  }

  initObservables(): void {
    const DAY0_DAYS_DATE = merge(
      this.paymentDay0Change(),
      this.paymentTermChange$(),
      this.paymentDaysChange$(),
      this.paymentDateChange$()
    )
      .pipe(
        debounceTime(0),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();

    this.rForm?.valueChanges
      .pipe(
        startWith(this.rForm.value),
        distinctUntilChanged(),
        tap((paymentTerms: IPaymentTerms) => {
          this.infoPaymentTerms = this.rForm?.valid
            ? this.paymentTermsService.infoPaymentTerms(this.rForm.value)
            : "Formularz zawiera błędy";
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe();
  }

  filterWeekends = (date: Date | null): boolean => {
    if (this.isWeekendAllowed) {
      return true;
    }
    const day = (date || new Date()).getDay();
    return day !== 0 && day !== 6;
  };

  payTermCompare(pTermOne: IPaymentTerm, pTermTwo: IPaymentTerm): boolean {
    return pTermOne.paymentTermId === pTermTwo.paymentTermId;
  }

  private clearValidatorsOnDayAndDate(): void {
    this.paymentDays$.clearValidators();
    this.paymentDate$.clearValidators();
    this.daysAndDateValidatorsUpdate();
  }

  private daysAndDateValidatorsUpdate(): void {
    this.paymentDays$.updateValueAndValidity();
    this.paymentDate$.updateValueAndValidity();
  }

  private setValidatorsOnDayAndDate(): void {
    this.paymentDays$.setValidators([Validators.required, Validators.min(0)]);
    this.paymentDate$.setValidators(Validators.required);
    this.paymentDate$.updateValueAndValidity();
  }

  private paymentDay0Change(): Observable<string> {
    return this.day0$.valueChanges.pipe(
      startWith(this.day0$.value),
      distinctUntilChanged(),
      tap((date: string) => {
        const DATE = this.paymentTermsService.addDaysToDateISOFormat(
          this.paymentDays$.value,
          new Date(date).toISOString()
        );
        this.paymentDate$.setValue(DATE, { emitEvent: false });
      })
    );
  }

  private paymentDaysChange$(): Observable<number> {
    return this.paymentDays$.valueChanges.pipe(
      startWith(this.paymentDays$.value ? this.paymentDays$.value : 1),
      distinctUntilChanged(),
      switchMap((daysNumber: number | null) => {
        if (daysNumber === null) {
          return of(0);
        }
        return of(daysNumber);
      }),
      tap((daysNumber: number) => {
        if (daysNumber !== null && daysNumber >= 0) {
          this.paymentDateUpdate(daysNumber);
        }
      })
    );
  }

  private paymentDateChange$(): Observable<string> {
    return this.paymentDate$.valueChanges.pipe(
      startWith(this.day0$.value),
      distinctUntilChanged(),
      tap((date: string) => {
        if (this.paymentDate$.valid) {
          const DATE_A = new Date(this.day0$.value).toISOString();
          const DATE_B = new Date(date).toISOString();

          const DAYS_DIFF =
            this.paymentTermsService.calcDateDifferenceISOFormat(
              DATE_A,
              DATE_B
            );

          if (DAYS_DIFF && DAYS_DIFF >= 0) {
            this.paymentDays$.setValue(DAYS_DIFF, {
              emitEvent: false,
            });
          }
        }
      })
    );
  }
  private paymentTermChange$(): Observable<IPaymentTerm> {
    return this.paymentTerm$.valueChanges.pipe(
      tap((paymentTerm: IPaymentTerm) => {
        this.updateValidators(paymentTerm);
      })
    );
  }

  private paymentDateUpdate(daysNumber: number): void {
    const dateAdded = this.paymentTermsService.addDaysToDateISOFormat(
      daysNumber,
      new Date(this.day0$.value).toISOString()
    );
    this.paymentDate$.setValue(new Date(dateAdded), {
      emitEvent: false,
    });
  }

  private updateValidators(paymentTerm: IPaymentTerm): void {
    if (paymentTerm.isPaymentDate) {
      this.setValidatorsOnDayAndDate();
    } else {
      this.clearValidatorsOnDayAndDate();
    }
  }

  //#region getters

  get day0$(): FormControl {
    return this.rForm?.get("day0") as FormControl;
  }

  get description$(): FormControl {
    return this.rForm?.get("description") as FormControl;
  }

  get paymentDate$(): FormControl {
    return this.rForm?.get("paymentDate") as FormControl;
  }

  get paymentDays$(): FormControl {
    return this.rForm?.get("paymentDays") as FormControl;
  }

  get paymentTerm$(): FormControl {
    return this.rForm?.get("paymentTerm") as FormControl;
  }

  get isDescription(): boolean {
    return (this.paymentTerm$.value as IPaymentTerm).isDescription;
  }
  get isPaymentDate(): boolean {
    return (this.paymentTerm$.value as IPaymentTerm).isPaymentDate;
  }
  //#endregion
}
