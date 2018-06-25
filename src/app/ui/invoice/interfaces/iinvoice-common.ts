import { ICompany } from "../../../shared/interfaces/icompany";
import { IInvoiceLineGroup, IInvoiceTotalGroup, IInvoiceRateGroup } from "../../../shared/interfaces/iinvoice-sell";
import { ICreationInfo } from "../../../shared/interfaces/i-creation-info";
import { Moment } from "moment";
import { ICurrency } from "@bpShared/currency/interfaces/i-currency";
import { IPaymentTerms } from "@bpShared/payment-terms/i-payment-terms";


export interface IInvoiceCommon extends ICreationInfo  {
    companyBuyer: ICompany,
    companySeller: ICompany,
    currency: ICurrency

    dateOfIssue: Moment,
    dateOfSell: Moment,
    
    info:string,
    isCorrection: boolean,
    invoiceNo: string,
    invoiceLines: IInvoiceLineGroup[],
    invoiceTotal: IInvoiceTotalGroup,
    paymentTerms: IPaymentTerms,
    rates: IInvoiceRateGroup[]
}