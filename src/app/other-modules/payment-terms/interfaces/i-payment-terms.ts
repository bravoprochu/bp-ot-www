import { IPaymentTerm } from './i-payment-term';

export interface IPaymentTerms {
  day0: Date | string;
  description?: string | null;
  paymentTerm: IPaymentTerm;
  paymentDate?: Date | string | null;
  paymentDays?: number | null;
}
