import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CurrencyListComponent } from "./currency-list/currency-list.component";
import { CurrencyCommonService } from "./currency-common.service";
import { CurrencyNbpComponent } from "./currency-nbp/currency-nbp.component";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
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
  NativeDateAdapter,
} from "@angular/material/core";
import { Platform, PlatformModule } from "@angular/cdk/platform";
import { CustomDateAdapterPl } from "./classes/custom-date-adapter-pl";
import { DateTimeCommonModule } from "../date-time-common/date-time-common.module";

const IMPORT_EXPORT_MODULES = [
  DateTimeCommonModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MomentCommonModule,
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
