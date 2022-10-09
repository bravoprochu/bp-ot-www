import { IBankAccount } from "../interfaces/ibank-account";

export type ContractorBankAccountSelected = IBankAccount & {
  isSelected?: boolean;
};
