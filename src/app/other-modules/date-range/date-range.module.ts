import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateRangeComponent } from "./components/date-range/date-range.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { DateTimeCommonModule } from "../date-time-common/date-time-common.module";
import { Platform } from "@angular/cdk/platform";
import { CustomDateAdapterPl } from "app/common-functions/angular-datepicker/custom-date-adapter-pl";

const IMPORT_EXPORT_MODULES = [
  DateTimeCommonModule,
  FlexLayoutModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [DateRangeComponent],
  exports: [IMPORT_EXPORT_MODULES, DateRangeComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterPl,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class DateRangeModule {}
