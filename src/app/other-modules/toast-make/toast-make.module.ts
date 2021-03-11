import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastMakeService } from "./toast-make.service";

const IMPORT_EXPORT_MODULES = [
  MatSnackBarModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES],
  providers: [ToastMakeService],
})
export class ToastMakeModule {}
