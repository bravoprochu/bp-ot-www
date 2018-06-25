import { IuserRole } from './iuser-role';
import { Iuser } from './iuser';
export interface IusersManagement {
    users: Iuser[],
    roles: IuserRole[]
}
