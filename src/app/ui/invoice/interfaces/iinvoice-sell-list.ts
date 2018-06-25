import { ICreationInfo } from '../../../shared/interfaces/i-creation-info';
export interface IInvoiceSellList {
    id: number,
    brutto: number,
    creationInfo: ICreationInfo,
    dataSprzedazy: string,
    documentNo: string,
    nabywca: string,
    netto:number,
    podatek: number,
    type: string,
    waluta: string    
}