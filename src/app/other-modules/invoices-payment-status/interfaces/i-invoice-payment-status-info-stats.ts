import { IInvoicePaymentStatusInfoCurrency } from "./i-invoice-payment-status-info-currency";

export interface IInvoicePaymentStatusInfoStats {
  currency: IInvoicePaymentStatusInfoCurrency;
  total: {
    total_brutto: number;
    total_netto: number;
    total_tax: number;
  };
  invoiceValue: number;
}
