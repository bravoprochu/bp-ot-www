import { ICreationInfo } from '../../../shared/interfaces/i-creation-info';
import { ICurrency } from "app/shared/interfaces/i-currency";
import { ICompany } from "app/shared/interfaces/icompany";
import { IInvoiceCommon } from './iinvoice-common';


export interface IInvoiceBuy extends IInvoiceCommon {
    invoiceBuyId:number,
    invoiceReceivedDate: string,
    isInvoiceReceived: boolean,
    paymentIsDone:boolean,
    paymentDate:string,
}
