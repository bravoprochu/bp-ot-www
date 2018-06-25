export interface IOrderTransEuPaymentPrice {
    value: number, //value passed as integer in the smallest unit of currency
    offset: number, //positive int (power of 10), i.e. how much cents are in 1 euro (it's 100 for most of currencies)
    currency: string //string (ISO 4217)
}
