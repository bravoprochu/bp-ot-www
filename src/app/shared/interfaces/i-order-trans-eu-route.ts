import { IAddress } from "app/other-modules/contractors/interfaces/iaddress";
import { IGeo } from "./igeo";

export interface IOrderTransEuRoute {
  place: {
    address: IAddress;
    coordinates: IGeo;
  };
  timespans: {
    begin: string; //dateTime
    end: string; //dateTime
  };
  type: string; //loading or unloading
  notes: string[];
  loads: string[]; //Can be used to hold references to specific loads by Load.custom_id
}
