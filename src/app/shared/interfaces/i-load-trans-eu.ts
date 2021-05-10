import { IIdValue } from "./iload";
import { IUnitValue } from "./iunit-value";
import { ILoadTransEuLoadingPlace } from "./i-load-trans-eu-loading-place";

export interface ILoadTransEu {
  loading_place: ILoadTransEuLoadingPlace;
  loading_date: string;
  unloading_place: ILoadTransEuLoadingPlace;
  unloading_date: string;
  price: number;
  price_currency: string;
  description: string;
  load_height: IUnitValue;
  load_length: IUnitValue;
  load_volume: IUnitValue;
  load_weight: IUnitValue;
  is_ltl: boolean;
  is_lift_required: boolean;
  is_truck_crane_required: boolean;
  is_tir_cable_required: boolean;
  is_tracking_system_required: boolean;
  is_for_clearence: boolean;
  pallets: ITransEuPallete;
  required_ways_of_loading: string[];
  required_adr_classes: string[];
  required_truck_body: IIdValue;
  contact_person: IIdValue[];
  type_of_load: IIdValue;
}

export interface ITransEuPerson {
  trans_id: string;
  custom_id: string;
  family_name: string;
}

export interface ITransEuPallete {
  loadRoutePalletId?: number;
  amount: number;
  dimmension?: string;
  info: string;
  is_exchangeable?: boolean;
  is_stackable?: boolean;
  type: string;
}
