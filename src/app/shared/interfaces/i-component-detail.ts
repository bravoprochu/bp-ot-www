import { IComponentCommon } from "@bpCommonInterfaces/i-component-common";
import { IPayloadDTO } from "@bpCommonInterfaces/i-payload-dto";


export interface IComponentDetail extends IComponentCommon
{
    init01ComponentData(): void,
    init02Form():void,
    init03RouteAndDataObservable(): void

    getCreationMenu(): void,
    getModificationMenu(): void,

    initrFormChanges(): void,
    initPayload(_payloadDTO: IPayloadDTO): void,
    initrFormData(_payloadDTO: IPayloadDTO): void,
}