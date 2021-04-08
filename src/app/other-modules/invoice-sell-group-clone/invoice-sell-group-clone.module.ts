import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceSellGroupCloneComponent } from "./components/invoice-sell-group-clone/invoice-sell-group-clone.component";
import { MatCardModule } from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MomentCommonModule } from "../moment-common/moment-common.module";
import { ToastMakeModule } from "../toast-make/toast-make.module";
import { DialogConfirmationsModule } from "../dialog-confirmations/dialog-confirmations.module";
import { ReactiveFormsModule } from "@angular/forms";
import { InvoiceSellGroupCloneService } from "./services/invoice-sell-group-clone.service";

const IMPORT_EXPORT_MODULES = [
  DragDropModule,
  DialogConfirmationsModule,
  FlexLayoutModule,
  MatCardModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MomentCommonModule,
  ReactiveFormsModule,
  ToastMakeModule,
];

@NgModule({
  declarations: [InvoiceSellGroupCloneComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [InvoiceSellGroupCloneService],
})
export class InvoiceSellGroupCloneModule {}
