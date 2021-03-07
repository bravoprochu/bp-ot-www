import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyListComponent } from "./currency-list/currency-list.component";
import { CurrencyCommonService } from "./currency-common.service";
import { CurrencyNbpComponent } from "./currency-nbp/currency-nbp.component";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";

const IMPORT_EXPORT_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MomentCommonModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  declarations: [CurrencyListComponent, CurrencyNbpComponent],
  exports: [IMPORT_EXPORT_MODULES, CurrencyListComponent, CurrencyNbpComponent],
  providers: [CurrencyCommonService],
})
export class CurrencyModule {}
