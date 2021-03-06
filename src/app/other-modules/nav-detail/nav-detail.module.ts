import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavDetailComponent } from "./components/nav-detail/nav-detail.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule } from "@angular/router";
import { DialogConfirmationsModule } from "../dialog-confirmations/dialog-confirmations.module";
import { ReactiveFormsModule } from "@angular/forms";

const IMPORT_EXPORT_MODULES = [
  DialogConfirmationsModule,
  FlexLayoutModule,
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  RouterModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [NavDetailComponent],
  exports: [IMPORT_EXPORT_MODULES, NavDetailComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class NavDetailModule {}
