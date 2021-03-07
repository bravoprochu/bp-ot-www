import {
  IInvoiceLineGroup,
  IInvoiceTotalGroup,
  IInvoiceRateGroup,
} from "../interfaces/iinvoice-sell";
import { ICreationInfo } from "../../../shared/interfaces/i-creation-info";
import { Moment } from "moment";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { IPaymentTerms } from "@bpShared/payment-terms/i-payment-terms";
import { ICompany } from "app/other-modules/contractors/interfaces/icompany";

export interface IInvoiceCommon extends ICreationInfo {
  companyBuyer: ICompany;
  companySeller: ICompany;
  currency: ICurrency;

  dateOfIssue: Moment;
  dateOfSell: Moment;

  info: string;
  isCorrection: boolean;
  invoiceNo: string;
  invoiceLines: IInvoiceLineGroup[];
  invoiceTotal: IInvoiceTotalGroup;
  paymentTerms: IPaymentTerms;
  rates: IInvoiceRateGroup[];
}
