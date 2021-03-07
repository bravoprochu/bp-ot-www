import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule,
} from "@angular/material";
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
import { DialogTakNieModule } from "../dialog-tak-nie/dialog-tak-nie.module";

const IMPORT_EXPORT_MODULES = [
  DialogTakNieModule,
  DragDropOptionsModule,
  FlexLayoutModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule,
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
  ],
  entryComponents: [CompanyComponent, CompanyCardComponent],
  exports: [
    IMPORT_EXPORT_MODULES,
    CompanyListComponent,
    CompanyCardComponent,
    CompanyComponent,
  ],
  imports: [CommonModule, ContractorsRoutingModule, IMPORT_EXPORT_MODULES],
  providers: [ContractorService],
})
export class ContractorsModule {}
