import { ICreationInfo } from './i-creation-info';
import { IEmployee } from './iemployee';
import { IGeo } from './igeo';
import { ICompany } from './icompany';
import { IAddress } from "app/shared/interfaces/iaddress";
import { IUnitValue} from "app/shared/interfaces/iunit-value"
import { IValueViewValue } from "app/shared/interfaces/ivalue-view-value";
import { ILoadingPlace } from "app/shared/interfaces/iloading-place";
import { Moment } from 'moment';
import { ICurrencyNbp } from '@bpShared/currency/interfaces/i-currency-nbp';
import { IPaymentTerms } from '@bpShared/payment-terms/i-payment-terms';
import { IInvoiceExtraInfo } from '@bpUI/invoice/interfaces/iinvoice-sell';

export interface ILoad{
    loadId:number,
    creationInfo: ICreationInfo,
    info:string,
    loadExtraInfo: IInvoiceExtraInfo,
    invoiceSellNo: string,
    loadNo: string,
    buy: ILoadBuy,
    sell: ILoadSell,
    transEu: ILoadTransEu
}

export interface ILoadTransEu{
    loadTransEuId?: number,
    contactPersonsList: IEmployee[],
    price: ICurrencyNbp,
    transEuId?: number,
    sellingCompany: ICompany
}


export interface ILoadSell{
    loadSellId?:number,
    selling_info: ILoadTradeInfo,
    principal: ICompany,
    contactPersonsList: IEmployee[]

}

export interface ILoadBuy {
    loadBuyId: number,
    loadNo:number,
    buying_info: ILoadTradeInfo,
    load_info: ILoadInfo,
    routes: ILoadRoute[]
}

export interface ILoadRoute{
    loadRouteId?:number
    loading_date: string,
    loading_type:string,
    address: IAddress,
    geo: IGeo,
    info: string,
    pallets: ILoadRoutePallete[]

}

export interface ILoadRoutePallete{
    loadRoutePalletId?: number,
    amount: number,
    dimmension?: string,
    info: string,
    is_exchangeable?: boolean,
    is_stackable?: boolean
    type: IValueViewValue,
}


export interface ILoadInfo{
    description: string,
    load_height?:IUnitValue,
    load_length?:IUnitValue,
    load_volume?:IUnitValue
    load_weight:IUnitValue,
    extraInfo: ILoadInfoExtra
}

export interface ILoadInfoExtra{
    is_ltl: boolean,
    is_lift_required: boolean,
    is_truck_crane_required: boolean,
    is_tir_cable_required: boolean,
    is_tracking_system_required: boolean,
    is_for_clearence: boolean,
    required_ways_of_loading: IValueViewValue[],
    required_adr_classes: IValueViewValue[],
    required_truck_body: IValueViewValue,
    type_of_load: IValueViewValue
}

export interface ILoadTradeInfo{
    company: ICompany,
    date: Moment,
    price: ICurrencyNbp,
    paymentTerms: IPaymentTerms
}

export interface IPallet
{
    type: IValueViewValue,
    dimmensions: string,
    amount: number,
    info:string,
    is_stackable: boolean,
    is_exchangeable: boolean
}

export interface IContactPerson{
    id:string,
    name:string
}

export interface IIdValue{
    id:string,
}