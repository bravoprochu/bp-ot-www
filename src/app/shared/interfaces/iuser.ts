import { IStatus } from './istatus';
import { IuserRole } from './iuser-role';
export interface Iuser {
 email:string,
 roles: IuserRole[],
 transId:string,
 transUserSecret: string,
 transScope:string[],
 userId:string,
 userName:string,
 status: IStatus
}
