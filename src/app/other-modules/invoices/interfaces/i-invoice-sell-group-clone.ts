import { IInvoiceSellLineList } from "./i-invoice-line-list";

export interface IInvoiceSellGroupClone {
  dateOfSell: string;
  dateOfIssue: string;
  invoiceList: IInvoiceSellLineList[];
  productName: string;
}
