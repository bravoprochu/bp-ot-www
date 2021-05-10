import { ICurrency } from "./i-currency";

export interface ICurrencyNbp {
  price: number;
  currency: ICurrency;
  plnValue: string;
  rate: number;
  rateDate: string;
  table?: string;
  no?: string;
}
