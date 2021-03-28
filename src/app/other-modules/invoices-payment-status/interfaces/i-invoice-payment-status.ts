import { IInvoicePaymentStatusInfo } from "./i-invoice-payment-status-info";
import { IInvoicePaymentStatusInfoStats } from "./i-invoice-payment-status-info-stats";

export interface IInvoicePaymentStatus {
  notConfirmed: IInvoicePaymentStatusInfo[];
  notConfirmedStats: IInvoicePaymentStatusInfoStats[];
  unpaid: IInvoicePaymentStatusInfo[];
  unpaidStats: IInvoicePaymentStatusInfoStats[];
  unpaidOverdue: IInvoicePaymentStatusInfo[];
  unpaidOverdueStats: IInvoicePaymentStatusInfoStats[];
}
