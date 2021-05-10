import { IInvoiceCommon } from "./iinvoice-common";

export interface IInvoiceBuy extends IInvoiceCommon {
  invoiceBuyId: number;
  invoiceReceivedDate: string;
  isInvoiceReceived: boolean;
  paymentIsDone: boolean;
  paymentDate: string;
}
