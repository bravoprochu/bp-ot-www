import { Injectable } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { PAYMENT_TERMS_OPTIONS } from "../data/payment-terms-options";
import { IPaymentTerm } from "../interfaces/i-payment-term";
import { IPaymentTerms } from "../interfaces/i-payment-terms";
import { DateTime, DurationObject } from "luxon";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { AbstractControlOptions, ValidatorFn } from "@angular/forms";

type FormGroupConfig<T> = {
  [P in keyof T]: [
    T[P] | { value: T[P]; disabled: boolean },
    (AbstractControlOptions | ValidatorFn | ValidatorFn[])?
  ];
};

@Injectable({
  providedIn: "root",
})
export class PaymentTermsService {
  paymentTerms$ = new Subject<IPaymentTerms>();

  constructor(private fb: FormBuilder) {}

  addDaysToDateISOFormat(daysToAdd: number, currentISODate: string): Date {
    if (daysToAdd < 0) {
      throw new Error("daysToAdd number should not be negative");
    }

    const DATE = DateTime.fromISO(currentISODate);
    const IS_DATE = DateTime.isDateTime(DATE) && DATE.isValid;

    if (IS_DATE === false) {
      throw new Error("current date string is invalid");
    }

    const CURRENT_DATE = DateTime.fromISO(currentISODate);
    const RES = new Date(CURRENT_DATE.plus({ days: +daysToAdd }).toString());

    return RES;
  }

  calcDateDifferenceISOFormat(
    dateISOFormatA: string,
    dateISOFormatB: string
  ): number {
    const A_DATE = DateTime.fromISO(dateISOFormatA);
    const B_DATE = DateTime.fromISO(dateISOFormatB);

    const DATE_A_IS_VALID_DATE = this.isLuxonDate(A_DATE) && A_DATE.isValid;
    const DATE_B_IS_VALID_DATE = this.isLuxonDate(B_DATE) && B_DATE.isValid;

    if (DATE_A_IS_VALID_DATE === false || DATE_B_IS_VALID_DATE === false) {
      throw new Error("Input date is invalid format/object date");
    }
    const DIFF = Math.ceil(B_DATE.diff(A_DATE, ["days"]).days);

    return DIFF;
  }

  infoPaymentTerms(paymentTerms: IPaymentTerms): string {
    const PAY_NAME = paymentTerms.paymentTerm.name;
    const IS_DATE = paymentTerms.paymentTerm.isPaymentDate ? true : false;

    const DAY_DATE = IS_DATE
      ? `, ${this.dzienDniFormat(
          paymentTerms.paymentDays as number
        )} w terminie: ${this.formatDateYearMonthDay(
          new Date(paymentTerms.paymentDate as Date)
        )}`
      : "";

    const DESCRIPTION =
      paymentTerms.paymentTerm.isDescription && paymentTerms.description
        ? `, ${paymentTerms.description}`
        : "";

    return `${PAY_NAME}${DAY_DATE}${DESCRIPTION}`;
  }
  convToLuxonDate(date: Date | string): DateTime {
    const LUXON_DATE =
      typeof date === "string"
        ? DateTime.fromISO(date)
        : DateTime.fromJSDate(date);

    if (LUXON_DATE && LUXON_DATE.isValid === false) {
      throw new Error("Input date is invalid format/object date");
    }

    return LUXON_DATE;
  }

  czySobotaLubNiedziela(date: Date): boolean {
    const DAY = DateTime.fromJSDate(date).weekdayLong;
    const NOT_SOBOTA_OR_NIEDZIELA = DAY === "sobota" || DAY === "niedziela";

    //const RES = NOT_WEEKEND_DAYS;

    return NOT_SOBOTA_OR_NIEDZIELA;
  }

  dzienDniFormat(daysNumber: number): string {
    return daysNumber && daysNumber === 1 ? "1 dzień" : `${daysNumber} dni`;
  }

  formatDateYearMonthDay(date: Date): string {
    return DateTime.fromJSDate(date).toISODate({ format: "extended" });
  }

  getPaymentTermsGroup$(): FormGroup {
    const PAYMENT_TERMS_CONFIG = {
      day0: [new Date(), Validators.required],
      paymentTerm: [this.getPaymentTermInitValue(), Validators.required],
      description: [null],
      paymentDate: [new Date()],
      paymentDays: [14],
    } as FormGroupConfig<IPaymentTerms>;

    const rForm = this.fb.group(PAYMENT_TERMS_CONFIG);

    return rForm;
  }

  getPaymentTermsInitValue(): IPaymentTerms {
    return {
      day0: new Date(),
      isWeenkendAllowed: false,
      paymentTerm: this.getPaymentTermInitValue(),
      paymentTermsOptions: PAYMENT_TERMS_OPTIONS,
    } as IPaymentTerms;
  }

  getPaymentTermInitValue(): IPaymentTerm {
    return PAYMENT_TERMS_OPTIONS[3];
  }

  getPaymentTermOptions(): IPaymentTerm[] {
    return PAYMENT_TERMS_OPTIONS;
  }
  getPaymentTermOptions$(): Observable<IPaymentTerm[]> {
    return of(PAYMENT_TERMS_OPTIONS);
  }

  isLuxonDate(date: any): boolean {
    return DateTime.isDateTime(date);
  }
}
