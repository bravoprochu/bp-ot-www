import { ICreationInfo } from '../../../shared/interfaces/i-creation-info';
export interface IInvoiceSellList {
    id: number,
    brutto: string,
    creationInfo: ICreationInfo,
    dataSprzedazy: string,
    documentNo: string,
    nabywca: string,
    netto:string,
    podatek: string,
    type: string,
    waluta: string    
}