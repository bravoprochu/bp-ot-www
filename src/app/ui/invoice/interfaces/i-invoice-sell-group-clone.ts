import { Moment } from "moment";
import { IInvoiceSellLineList } from "./i-invoice-line-list";

export interface IInvoiceSellGroupClone{
    dateOfSell: Moment,
    dateOfIssue: Moment,
    invoiceList: IInvoiceSellLineList[],
    productName: string

}