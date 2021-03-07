import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreationInfoComponent } from "./components/creation-info/creation-info.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

const IMPORT_EXPORT_MODULES = [FlexLayoutModule, ReactiveFormsModule];

@NgModule({
  declarations: [CreationInfoComponent],
  exports: [IMPORT_EXPORT_MODULES, CreationInfoComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class CreationInfoModule {}
