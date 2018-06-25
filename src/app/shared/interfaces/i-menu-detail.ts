import { EventEmitter } from "@angular/core";

export interface IMenuDetail
{
    canCreate:boolean,
    canDelete:boolean,
    canUpdate:boolean,
    canRefresh:boolean,
    create:EventEmitter<any>,
    delete:EventEmitter<any>,
    isExtraInfo:boolean,
    isError:boolean,
    update:EventEmitter<any>,
    refresh: EventEmitter<any>,
}