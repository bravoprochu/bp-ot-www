import { AbstractControl, ValidatorFn } from "@angular/forms";
import { ICurrency } from "../interfaces/i-currency";

export const CHECK_IF_CURRENCY_NOT_PLN_VALIDATOR = (): ValidatorFn => (
  control: AbstractControl
): {
  [key: string]: any;
} | null => {
  const CURRENCY_NAME = control.get("currency");
  const forbidden = (CURRENCY_NAME?.value as ICurrency).name !== "PLN";

  return forbidden ? null : { NieMozeBycPLN: "PLN" };
};
