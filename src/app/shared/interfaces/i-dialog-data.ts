import { DialogDataTypes } from '../enums/dialog-data-types.enum';
export interface IDialogData {
    componentKeyName?: string
    type: DialogDataTypes,
    formData?: any,
    isFormPassed?: boolean,
}
