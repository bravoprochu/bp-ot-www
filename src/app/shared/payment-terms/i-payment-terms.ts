import { IPaymentTerm } from "./i-payment-term";
import { InvoiceTypeEnum } from "@bpCommonInterfaces/i-invoice-type-enum";
import { Moment } from "moment";


export interface IPaymentTerms {
    combined: string,
    day0:Moment,
    description?: string,
    paymentTerm: IPaymentTerm,
    paymentDate?: Moment,
    paymentDays?: number,
    paymentTermId: number,
    invoiceType: InvoiceTypeEnum,
}
