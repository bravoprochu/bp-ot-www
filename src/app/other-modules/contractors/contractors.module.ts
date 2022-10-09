import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { AddressComponent } from "./components/address/address.component";
import { CompanyListComponent } from "./components/company-list/company-list.component";
import { CompanyComponent } from "./components/company/company.component";
import { CompanyCardComponent } from "./components/company-card/company-card.component";
import { ToastMakeModule } from "../toast-make/toast-make.module";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";
import { ContractorsRoutingModule } from "./contractors-routing.module";
import { ContractorService } from "./services/contractor.service";
import { DragDropOptionsModule } from "../drag-drop-options/drag-drop-options.module";
import { DialogConfirmationsModule } from "../dialog-confirmations/dialog-confirmations.module";
import { NavListModule } from "../nav-list/nav-list.module";
import { DataExportsModule } from "../data-exports/data-exports.module";
import { OwnerBankAccountSelectorComponent } from "./components/owner-bank-account-selector/owner-bank-account-selector.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

const IMPORT_EXPORT_MODULES = [
  DialogConfirmationsModule,
  DataExportsModule,
  DragDropOptionsModule,
  FlexLayoutModule,
  FormsModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule,
  NavListModule,
  PendingIndicatorModule,
  ReactiveFormsModule,
  RouterModule,
  ToastMakeModule,
];

@NgModule({
  declarations: [
    AddressComponent,
    CompanyListComponent,
    CompanyComponent,
    CompanyCardComponent,
    OwnerBankAccountSelectorComponent,
  ],
  entryComponents: [CompanyComponent, CompanyCardComponent],
  exports: [
    ...IMPORT_EXPORT_MODULES,
    CompanyListComponent,
    CompanyCardComponent,
    CompanyComponent,
    OwnerBankAccountSelectorComponent,
  ],
  imports: [CommonModule, ContractorsRoutingModule, ...IMPORT_EXPORT_MODULES],
  providers: [ContractorService],
})
export class ContractorsModule {}
