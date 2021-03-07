import { ICreationInfo } from "../../../shared/interfaces/i-creation-info";
import { ILoadTradeInfo } from "app/shared/interfaces/iload";
import { IAddressShort } from "app/other-modules/transport/interfaces/iaddress-short";

export interface ITransportOffer {
  transportOfferId?: number;
  creationInfo: ICreationInfo;
  driver: string;
  info: string;
  invoiceSellId?: number;
  invoiceSellNo: string;
  offerNo: string;
  tradeInfo: ILoadTradeInfo;
  load: IAddressShort;
  unload: IAddressShort;
}
