import { IOrderTransEuPaymentPrice } from './i-order-trans-eu-payment-price'; 
export interface IOrderTransEuPayment {
    price: IOrderTransEuPaymentPrice,
    interval_of_days: IOrderTransEuPaymentPrice,
    status: string
}
