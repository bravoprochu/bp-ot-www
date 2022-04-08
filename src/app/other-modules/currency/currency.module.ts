import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyListComponent } from "./currency-list/currency-list.component";
import { CurrencyCommonService } from "./currency-common.service";
import { CurrencyNbpComponent } from "./currency-nbp/currency-nbp.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { Platform, PlatformModule } from "@angular/cdk/platform";
import { DateTimeCommonModule } from "../date-time-common/date-time-common.module";
import { CustomDateAdapterPl } from "app/common-functions/angular-datepicker/custom-date-adapter-pl";
import { FlexLayoutModule } from "@angular/flex-layout";

const IMPORT_EXPORT_MODULES = [
  DateTimeCommonModule,
  FlexLayoutModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  PlatformModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  declarations: [CurrencyListComponent, CurrencyNbpComponent],
  exports: [IMPORT_EXPORT_MODULES, CurrencyListComponent, CurrencyNbpComponent],
  providers: [
    CurrencyCommonService,
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterPl,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class CurrencyModule {}
