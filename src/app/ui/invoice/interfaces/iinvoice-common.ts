import { ICompany } from "../../../shared/interfaces/icompany";
import { ICurrency } from "../../../shared/interfaces/i-currency";
import { IInvoiceLineGroup, IInvoiceTotalGroup, IInvoiceRateGroup } from "../../../shared/interfaces/iinvoice-sell";
import { ICreationInfo } from "../../../shared/interfaces/i-creation-info";
import { IPaymentTerms } from "../../../shared/interfaces/iinvoice-payment-terms";


export interface IInvoiceCommon extends ICreationInfo  {
    companyBuyer: ICompany,
    companySeller: ICompany,
    currency: ICurrency

    dateOfIssue: string,
    dateOfSell: string
    
    info:string,
    isCorrection: boolean,
    invoiceNo: string,
    invoiceLines: IInvoiceLineGroup[],
    invoiceTotal: IInvoiceTotalGroup,
    paymentTerms: IPaymentTerms,
    rates: IInvoiceRateGroup[]
}