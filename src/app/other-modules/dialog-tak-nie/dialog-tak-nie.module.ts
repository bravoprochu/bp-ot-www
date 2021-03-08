import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DialogTakNieComponent } from "./components/dialog-tak-nie/dialog-tak-nie.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { FlexLayoutModule } from "@angular/flex-layout";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatDialogModule,
];

@NgModule({
  declarations: [DialogTakNieComponent],
  entryComponents: [DialogTakNieComponent],
  exports: [IMPORT_EXPORT_MODULES, DialogTakNieComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class DialogTakNieModule {}
