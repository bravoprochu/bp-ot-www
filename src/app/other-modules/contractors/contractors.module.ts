import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
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
import { DialogTakNieModule } from "../dialog-tak-nie/dialog-tak-nie.module";
import { NavListModule } from "../nav-list/nav-list.module";

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
