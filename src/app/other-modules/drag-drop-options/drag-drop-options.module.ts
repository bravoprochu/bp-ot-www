import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableDragDropOptionsComponent } from "@bpShared/table-drag-drop-options/table-drag-drop-options.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatExpansionModule, MatIconModule } from "@angular/material";
import { DragDropModule } from "@angular/cdk/drag-drop";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatExpansionModule,
  MatIconModule,
  DragDropModule,
];

@NgModule({
  declarations: [TableDragDropOptionsComponent],
  exports: [IMPORT_EXPORT_MODULES, TableDragDropOptionsComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
})
export class DragDropOptionsModule {}
