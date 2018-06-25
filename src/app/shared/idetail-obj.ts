import { INavDetailInfo } from './interfaces/inav-detail-info';
import { Subject } from 'rxjs';
export interface IDetailObj {
  
    isPending: boolean,
    navDetailInfo:INavDetailInfo,

    rForm: any,
    routeId:number,
    
    initForm(): void,
    initRouteId():void,
    initData():void,
    isDestroyed$: Subject<boolean>,

    navCancel():void,
    navDownload():void,
    navDelete(): void,
    navSave(): void

}
