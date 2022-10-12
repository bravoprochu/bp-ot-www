import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { tap } from "rxjs/operators";
import { ContractorService } from "../../services/contractor.service";
import { ContractorBankAccountSelected } from "../../types";

@Component({
  selector: "app-owner-bank-account-selector",
  templateUrl: "./owner-bank-account-selector.component.html",
  styleUrls: ["./owner-bank-account-selector.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OwnerBankAccountSelectorComponent,
      multi: true,
    },
  ],
})
export class OwnerBankAccountSelectorComponent implements ControlValueAccessor {
  bankAccounts = [] as ContractorBankAccountSelected[];
  isDisabled = false;

  onChange: (value: ContractorBankAccountSelected[]) => void;
  onTouched: (value: boolean) => void;
  ownerInfo$ = this.contractorService.getOwnerInfo$.pipe(
    tap((ownerInfo) => {
      this.bankAccounts = ownerInfo.bankAccountList.map(
        (bankAccount) =>
          ({
            ...bankAccount,
            isSelected: true,
          } as ContractorBankAccountSelected)
      );
      this.selectedChanged();
    })
  );

  constructor(private contractorService: ContractorService) {}

  writeValue(obj: any): void {
    return;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  selectedChanged() {
    const filteredValues = this.bankAccounts.filter(
      (account) => account.isSelected
    );
    this.onChange(filteredValues);
    this.onTouched(true);
  }
}
