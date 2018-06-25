import { ITitle } from "app/shared/ititle";
import { Subject } from "rxjs";

export interface IListObj {
    navTitle:ITitle,
    isDestroyed$: Subject<boolean>,
    isPending: boolean,
    createNew():void,
    edit(id: number):void,
    initData(IDateRange?):void,
}

