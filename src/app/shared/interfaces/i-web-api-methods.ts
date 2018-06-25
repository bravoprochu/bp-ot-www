import { IDateRange } from "@bpCommonInterfaces/i-date-range";
import { IComponentData } from "@bpCommonInterfaces/i-component-data";
import { Observable } from "rxjs";
import { IPayloadDTO } from "@bpCommonInterfaces/i-payload-dto";


export interface IWebAPIMethods
{
    create(obj:any, componentData:IComponentData): Observable<IPayloadDTO>,
    delete(id: number, componentData: IComponentData),
    getById(id: number, componentData: IComponentData):Observable<IPayloadDTO>,
    getList(componentData: IComponentData):Observable<IPayloadDTO>,
    getListDateRange(dateRange:IDateRange, componentData: IComponentData): Observable<IPayloadDTO>,
    update(id: number, obj:any, componentData: IComponentData): Observable<IPayloadDTO>
}