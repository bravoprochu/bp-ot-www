import { ICurrency } from "./i-currency";
import { Moment } from "moment";

export interface ICurrencyNbp{
    price:number,
    currency: ICurrency,
    plnValue:number
    rate: number,
    rateDate: Moment
}