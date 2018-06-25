export interface IOrderTransEuRequirements {
    required_ways_of_loading: string[],     // Enum values: top, side, back. Says which side load should be put into the vehicle
    required_truck_bodies: string[],
    required_adr_classes: string[] // Enum values: hazard classes ie. 4.1
    is_truck_crane_required: boolean,
    is_lift_required: boolean,
    is_for_clearance: boolean, //whether load should be "ready to declare" - to excise on country border
    is_tir_cable_required: boolean, //whether load should be secured by ropes
    is_ftl: boolean //whether shipper requires vehicles exclusively for purpose of carrying the loads
    is_tracking_system_required: boolean, // whether shipper requires GPS tracking of carrier's vehicles
    shipping_remarks: string // place for shippers additional remarks & requirements
}