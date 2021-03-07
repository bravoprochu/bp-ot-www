import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavDetailComponent } from "./components/nav-detail/nav-detail.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonToggleModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  RouterModule,
];

@NgModule({
  declarations: [NavDetailComponent],
  exports: [IMPORT_EXPORT_MODULES, NavDetailComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class NavDetailModule {}
