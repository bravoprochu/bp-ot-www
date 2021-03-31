import { InvoiceStatusConfirmationType } from "./invoice-status-confirmation-type";
import { IDialogDateConfirmationReturn } from "../../dialog-confirmations/interfaces/i-dialog-date-confirmation-return";

export interface IInvoiceStatusConfirmation
  extends IDialogDateConfirmationReturn {
  confirmationType: InvoiceStatusConfirmationType;
}
