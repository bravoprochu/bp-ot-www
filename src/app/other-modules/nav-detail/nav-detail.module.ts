import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavDetailComponent } from "./components/nav-detail/nav-detail.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { DialogTakNieModule } from "../dialog-tak-nie/dialog-tak-nie.module";

const IMPORT_EXPORT_MODULES = [
  DialogTakNieModule,
  FlexLayoutModule,
  MatButtonModule,
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
