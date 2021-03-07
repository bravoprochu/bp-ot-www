import { IInvoicePos } from "./iinvoice-pos";
import { IInvoiceTotal } from "./iinvoice-total";
import { IInvoiceCommon } from "./iinvoice-common";
import { IInvoiceRate } from "./iinvoice-rate";
import { Moment } from "moment";
import { ICurrencyNbp } from "app/other-modules/currency/interfaces/i-currency-nbp";

export interface IInvoiceSell extends IInvoiceCommon {
  invoiceSellId: number;
  isToRepeat: boolean;
  extraInfo: IInvoiceExtraInfo;
  getCorrectionPaymenntInfo: string;
  getInvoiceValue: number;
  loadId?: number;
  loadNo: string;
  paymentIsDone: boolean;
  paymentDate: Moment;
}

export interface IInvoiceLineGroup {
  corrections: IInvoicePos;
  current: IInvoicePos;
  original: IInvoicePos;
}

export interface IInvoiceRateGroup {
  vatRate: string;
  corrections: IInvoiceRate;
  current: IInvoiceRate;
  original: IInvoiceRate;
}

export interface IInvoiceTotalGroup {
  corrections: IInvoiceTotal;
  current: IInvoiceTotal;
  original: IInvoiceTotal;
}

export interface IInvoiceExtraInfo {
  cmr: IInvoiceExtraInfoChecked;
  currencyNbp: ICurrencyNbp;
  recived: IInvoiceExtraInfoChecked;
  sent: IInvoiceExtraInfoChecked;
  invoiceBuyId?: number;
  invoiceBuyNo: string;
  is_load_no: boolean;
  is_in_words: boolean;
  is_tax_nbp_exchanged: boolean;
  loadNo;
  tax_exchanged_info: string;
  tax_nbp: ICurrencyNbp;
  total_brutto_in_words: string;
  transportOfferId: number;
  transportOfferNo: string;
}

export interface IInvoiceExtraInfoChecked {
  invoiceExtraInfoCheckedId?: number;
  checked: boolean;
  date: Moment;
  info: string;
}
