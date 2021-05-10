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
import { ToastMakeModule } from "../toast-make/toast-make.module";
import { DialogConfirmationsModule } from "../dialog-confirmations/dialog-confirmations.module";
import { ReactiveFormsModule } from "@angular/forms";
import { InvoiceSellGroupCloneService } from "./services/invoice-sell-group-clone.service";
import { DateTimeCommonModule } from "../date-time-common/date-time-common.module";
import { Platform } from "@angular/cdk/platform";
import {
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { CustomDateAdapterPl } from "app/common-functions/angular-datepicker/custom-date-adapter-pl";

const IMPORT_EXPORT_MODULES = [
  DateTimeCommonModule,
  DragDropModule,
  DialogConfirmationsModule,
  FlexLayoutModule,
  MatCardModule,
  MatDatepickerModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  ToastMakeModule,
];

@NgModule({
  declarations: [InvoiceSellGroupCloneComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [
    InvoiceSellGroupCloneService,
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterPl,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class InvoiceSellGroupCloneModule {}
