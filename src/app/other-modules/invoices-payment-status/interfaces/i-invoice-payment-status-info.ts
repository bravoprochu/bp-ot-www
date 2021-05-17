import { IInvoicePaymentStatusInfoCurrency } from "./i-invoice-payment-status-info-currency";

export interface IInvoicePaymentStatusInfo {
  dateOfIssue: string;
  dateOfSell: string;
  paymentDate: string;
  company: {
    companyId: number;
    shortName: string;
    vatId: string;
    address: string;
    contact: string;
    bankAccounts: string[];
  };
  currency: IInvoicePaymentStatusInfoCurrency;
  correctionPaymenntInfo: string;
  daysOverdue: number | null;
  invoiceId: number;
  invoiceNo: string;
  invoiceTotal: {
    total_brutto: number;
    total_netto: number;
    total_tax: number;
  };
  invoiceValue: number;
  IsCmrReceived: boolean;
  IsInvoiceSent: boolean;
  IsInvoiceReceived: boolean;
  isTransportOrLoadInvoice: boolean;
  paymentDays: number;
  receivedInvoiceDate: string | null;
}
