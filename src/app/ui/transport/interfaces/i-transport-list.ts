import { ICreationInfo } from "app/shared/interfaces/i-creation-info";

export interface ITransportList{
    transportOfferId:number,
    currency:string,
    creationInfo: ICreationInfo,
    documentNo: string,
    frach:number,
    loadDate:string,
    loadPlace: string,
    loadPostalCode:string,
    companySeller: string,
    unloadDate:string,
    unloadPlace: string,
    unloadPostalCode:string
}