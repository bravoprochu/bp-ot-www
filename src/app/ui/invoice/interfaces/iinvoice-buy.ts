import { IInvoiceCommon } from './iinvoice-common';
import { Moment } from 'moment';


export interface IInvoiceBuy extends IInvoiceCommon {
    invoiceBuyId:number,
    invoiceReceivedDate: Moment,
    isInvoiceReceived: boolean,
    paymentIsDone:boolean,
    paymentDate:Moment,
}
