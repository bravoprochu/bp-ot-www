import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { TableDragDropOptionsComponent } from "./components/table-drag-drop-options/table-drag-drop-options.component";

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
