import { ILoadTransEuAddress } from "./i-load-trans-eu-address";
import { IGeo } from "./igeo";
import { IAddress } from "../../other-modules/contractors/interfaces/iaddress";
export interface ILoadTransEuLoadingPlace {
  address: ILoadTransEuAddress;
  geo: IGeo;
}
