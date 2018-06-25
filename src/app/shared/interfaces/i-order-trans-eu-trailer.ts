import { IUnitValue } from './iunit-value';
export interface IOrderTransEuTrailer {
    custom_id: string,
    registration_plate_number: string,
    body_type: string,
    bearing_capacity: IUnitValue
}
