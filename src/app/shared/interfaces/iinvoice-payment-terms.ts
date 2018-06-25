import { Moment } from "moment";

export interface IPaymentTerms {
    day0:Moment,
    description?: string,
    paymentId: number,
    paymentTerm: IPaymentTerm,
    paymentDate?: Moment,
    paymentDays?: number,
    paymentTermsCombined:string

}

export interface IPaymentTerm {
    paymentTermId:number,
    name: string,
    isDescription: boolean,
    isPaymentDate: boolean,
}