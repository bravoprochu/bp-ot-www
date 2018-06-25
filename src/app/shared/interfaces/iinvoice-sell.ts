import { IPaymentTerms } from './iinvoice-payment-terms';
import { ICreationInfo } from 'app/shared/interfaces/i-creation-info';

import { IInvoiceLine } from './iinvoice-pos';
import { IInvoiceTotal } from './iinvoice-total';
import { IInvoiceCommon } from '../../ui/invoice/interfaces/iinvoice-common';
import { IInvoiceRate } from './iinvoice-rate-value';
import { Moment } from 'moment';
import { ICurrencyNbp } from '@bpShared/currency/interfaces/i-currency-nbp';

export interface IInvoiceSell extends IInvoiceCommon {
    invoiceSellId:number,
    extraInfo:IInvoiceExtraInfo,
    getCorrectionPaymenntInfo: string,
    getInvoiceValue:number,
    loadId?:number,
    loadNo:string,
    paymentIsDone:boolean,
    paymentDate:Moment,
}

export interface IInvoiceLineGroup
{
    corrections: IInvoiceLine[],
    current: IInvoiceLine[],
    original: IInvoiceLine[],    
}


export interface IInvoiceRateGroup
{
    vatRate: string,
    corrections: IInvoiceRate,
    current: IInvoiceRate,
    original: IInvoiceRate,
}

export interface IInvoiceTotalGroup
{
    corrections: IInvoiceTotal,
    current: IInvoiceTotal,
    original: IInvoiceTotal
}


export interface IInvoiceExtraInfo
{
    cmr: IInvoiceExtraInfoChecked,
    recived: IInvoiceExtraInfoChecked,
    sent: IInvoiceExtraInfoChecked
    invoiceBuyId?:number,
    invoiceBuyNo:string,
    is_load_no: boolean
    is_in_words: boolean,
    is_tax_nbp_exchanged: boolean,
    loadNo,
    tax_exchanged_info: string,
    tax_nbp: ICurrencyNbp,
    total_brutto_in_words: string,
    transportOfferId:number,
    transportOfferNo: string

}

export interface IInvoiceExtraInfoChecked
{
    invoiceExtraInfoCheckedId?: number,
    checked: boolean,
    date: Moment,
    info: string
}