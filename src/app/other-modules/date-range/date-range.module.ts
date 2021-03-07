import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateRangeComponent } from "./components/date-range/date-range.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
} from "@angular/material";
import { ReactiveFormsModule } from "@angular/forms";

const IMPORT_EXPORT_MODULES = [
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
})
export class DateRangeModule {}
