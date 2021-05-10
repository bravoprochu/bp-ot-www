import { INbpTableCurrencyDateRateResponse } from "./i-nbp-table-currency-date-rate-response";

export interface INbpTableCurrencyDateResponse {
  code: string;
  currency: string;
  rates: INbpTableCurrencyDateRateResponse[];
  table: string;
}
