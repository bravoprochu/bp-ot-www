import { IAddress } from "app/shared/interfaces/iaddress";
import { IEmployee } from "app/shared/interfaces/iemployee";
import { IBankAccount } from "app/shared/interfaces/ibank-account";

export interface ICompany {
    companyId:number,
    addressList: IAddress[],
    bankAccountList: IBankAccount[],
    transEuClientId:string,
    id: string,
    short_name: string,
    legal_name: string,
    vat_id:string,
    native_name: string,
    short_native_name: string,
    telephone: string,
    fax_number: string,
    email:string,
    url: string,

    employeeList: IEmployee[],
}
