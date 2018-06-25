import { IStatus } from "app/shared/interfaces/istatus";

export interface IEmployee extends IStatus {
    companyEmployeeId: number,
    id: number,
    given_name: string,
    family_name: string,
    trans_id:string,
    email: string,
    telephone: string,
    registration_date:string,
    last_login_date:string,
    entitled:boolean,
    hidden:boolean,
    is_driver:boolean,
    is_moderator: boolean,
}
