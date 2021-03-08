import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateRangeComponent } from "./components/date-range/date-range.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { MomentCommonModule } from "../moment-common/moment-common.module";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMomentDateModule,
  MomentCommonModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [DateRangeComponent],
  exports: [IMPORT_EXPORT_MODULES, DateRangeComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
  ],
})
export class DateRangeModule {}
