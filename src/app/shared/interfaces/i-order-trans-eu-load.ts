import { IOrderTransEuContractor } from './i-order-trans-eu-contractor'; 
import { IOrderTransEuRequirements } from './i-order-trans-eu-requirements';
import { IUnitValue } from './iunit-value';
export interface IOrderTransEuLoad {
    custom_id:string,
    name: string,
    description,
    type_of_load: string,
    weight: IUnitValue,
    heigh:IUnitValue,
    width:IUnitValue,
    length:IUnitValue,
    volume: IUnitValue,
    amount:number,
    requirements: IOrderTransEuRequirements,
    shipper: IOrderTransEuContractor,
    carrier: IOrderTransEuContractor,
    payer:IOrderTransEuContractor
}
