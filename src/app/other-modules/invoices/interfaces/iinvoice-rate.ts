export interface IInvoiceRate {
    rate_value_id: number,
    baseRateId:number,
    brutto_value: number,
    netto_value: number,
    vat_rate: string,
    vat_value: number
}