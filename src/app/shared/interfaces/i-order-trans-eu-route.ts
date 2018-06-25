import { IGeo } from './igeo';
import { IAddress } from './iaddress';
export interface IOrderTransEuRoute {
    place: {
            address: IAddress,
            coordinates: IGeo
    },
    timespans: {
        begin: string, //dateTime
        end: string //dateTime
    },
    type: string, //loading or unloading
    notes:string[], 
    loads: string[] //Can be used to hold references to specific loads by Load.custom_id
}
