import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { AddressComponent } from "./components/address/address.component";
import { CompanyListComponent } from "./components/company/company-list/company-list.component";
import { CompanyComponent } from "./components/company/company/company.component";
import { CompanyCardComponent } from "./components/company/company-card/company-card.component";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  ReactiveFormsModule,
  RouterModule,
];

@NgModule({
  declarations: [
    AddressComponent,
    CompanyListComponent,
    CompanyComponent,
    CompanyCardComponent,
  ],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [
    IMPORT_EXPORT_MODULES,
    CompanyListComponent,
    CompanyCardComponent,
    CompanyComponent,
  ],
  providers: [],
})
export class ContractorModule {}
