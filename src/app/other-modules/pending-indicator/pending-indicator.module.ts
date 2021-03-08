import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PendingComponent } from "./components/pending/pending.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";

const IMPORT_EXPORT_MODULES = [MatProgressBarModule];

@NgModule({
  declarations: [PendingComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  exports: [IMPORT_EXPORT_MODULES, PendingComponent],
})
export class PendingIndicatorModule {}
