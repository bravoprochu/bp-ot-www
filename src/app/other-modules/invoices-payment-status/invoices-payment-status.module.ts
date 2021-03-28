import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesPaymentStatusRoutingModule } from "./invoices-payment-status-routing.module";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PaymentRemindDialogComponent } from "./components/payment-remind-dialog/payment-remind-dialog.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { InvoicesPaymentStatusService } from "./services/invoices-payment-status.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import { InvoicesPaymentStatusComponent } from "./components/invoices-payment-status/invoices-payment-status.component";
import { FlexLayoutModule } from "@angular/flex-layout";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  FormsModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMomentDateModule,
  MatTabsModule,
  MatTooltipModule,
  PendingIndicatorModule,
  RouterModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [InvoicesPaymentStatusComponent, PaymentRemindDialogComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [
    CommonModule,
    InvoicesPaymentStatusRoutingModule,
    IMPORT_EXPORT_MODULES,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    InvoicesPaymentStatusService,
  ],
})
export class InvoicesPaymentStatusModule {}
