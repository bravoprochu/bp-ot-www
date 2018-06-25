export interface ILoadList {
    loadId: number,
    buying_price: number,
    description: string,
    is_ordered: boolean,
    is_transport_confirmed: boolean,

    loading_place: string,
    loading_places:number,
    load_name: string,
    
    selling_price:number,
    unloading_place:string,
    unloading_places:number,
}
