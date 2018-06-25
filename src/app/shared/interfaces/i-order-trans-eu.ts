import { IOrderTransEuDriver } from './i-order-trans-eu-driver';
import { IOrderTransEuOrderVehicle } from './i-order-trans-eu-order-vehicle';
import { IOrderTransEuDocument } from './i-order-trans-eu-document';
import { IOrderTransEuPayment } from './i-order-trans-eu-payment';
import { IOrderTransEuContractor } from './i-order-trans-eu-contractor';
import { IOrderTransEuLoad } from './i-order-trans-eu-load';
import { IOrderTransEuRoute } from './i-order-trans-eu-route';
import { IContactPerson } from './iload';
export interface IOrderTransEu {
        custom_ids?: IContactPerson[],
        number?: string,
        status?: string,
        terms?: string,
        description?: string,
        route?: IOrderTransEuRoute[],
        loads: IOrderTransEuLoad[],
        shipper?: IOrderTransEuContractor,
        carrier?: IOrderTransEuContractor,
        payer:IOrderTransEuContractor,
        payment: IOrderTransEuPayment,
        documents?: IOrderTransEuDocument[],
        vehicles?: IOrderTransEuOrderVehicle[],
        drivers?: IOrderTransEuDriver[]
}
