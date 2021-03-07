import { IPallet } from "./iload";
import { IAddress } from "app/other-modules/contractors/interfaces/iaddress";
import { IGeo } from "app/shared/interfaces/igeo";

export interface ILoadingPlace {
  address: IAddress;
  geo: IGeo;
  loading_date: string;
  loading_type: string;
  pallets: IPallet[];
  info: string;
}
