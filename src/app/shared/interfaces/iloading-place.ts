import { IPallet } from './iload';
import { IAddress } from "app/shared/interfaces/iaddress";
import { IGeo } from "app/shared/interfaces/igeo";

export interface ILoadingPlace {
    address: IAddress,
    geo: IGeo,
    loading_date: string,
    loading_type: string,
    pallets:IPallet[],
    info:string
}
