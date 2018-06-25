import { ICurrencyNbpResultRate } from "./i-currency-nbp-result-rate";

export interface ICurrencyNbpResult{
    code: string,
    currency: string,
    rates: ICurrencyNbpResultRate[],
    table: string,
}