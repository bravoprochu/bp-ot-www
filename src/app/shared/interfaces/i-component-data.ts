import { IDataFactoryError } from "@bpCommonInterfaces/i-data-factory-error";
import { IPayloadDTO } from "@bpCommonInterfaces/i-payload-dto";
import { Observable, BehaviorSubject, Subject } from "rxjs";

export interface IComponentData{
    data$: Subject<IPayloadDTO>,
    dataPassed$: Observable<IPayloadDTO>,
    errorInfo: IComponentDataErrorInfo,
    isDestroyed$: Subject<boolean>,
    isCardMode: boolean,
    isDataPassed: boolean,
    isError: boolean,
    isPending: boolean,
    
}

export interface IComponentDataErrorInfo {
    reset$: Subject<boolean>,
    errorList: IDataFactoryError[],
    error$: BehaviorSubject<IDataFactoryError>,
    isContinuing$: BehaviorSubject<boolean>,

}


