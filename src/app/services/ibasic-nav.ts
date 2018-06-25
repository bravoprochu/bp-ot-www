export interface IBasicNav {
    canCreate:boolean,
    canDelete:boolean
    canSave:boolean,
    create(): any,
    delete(): any    
    save(): any,
}
