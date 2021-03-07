import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavListComponent } from "@bpShared/nav-list/nav-list.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DateRangeModule } from "../date-range/date-range.module";
import {
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  DateRangeModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  RouterModule,
];

@NgModule({
  declarations: [NavListComponent],
  exports: [IMPORT_EXPORT_MODULES, NavListComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class NavListModule {}
