
import { IAddress } from './iaddress';
import { IOrderTransEuPerson } from 'app/shared/interfaces/i-order-trans-eu-person';
export interface IOrderTransEuContractor {
    trans_company_id: number,
    custom_id: string,
    name: string,
    vat_id: string,
    email: string,
    telephone: string,
    fax: string,
    address: IAddress
    contact_persons: IOrderTransEuPerson,
}
