import { InvoiceStatusConfirmationType } from "./invoice-status-confirmation-type";
import { IInvoicesPaymentStatusConfirmDialogDataReturn } from "./i-invoices-payment-status-confirm-dialog-data-return";

export interface IInvoiceStatusConfirmation
  extends IInvoicesPaymentStatusConfirmDialogDataReturn {
  confirmationType: InvoiceStatusConfirmationType;
}
