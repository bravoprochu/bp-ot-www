import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesPaymentStatusRoutingModule } from "./invoices-payment-status-routing.module";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { InvoicesPaymentStatusService } from "./services/invoices-payment-status.service";
import { InvoicesPaymentStatusComponent } from "./components/invoices-payment-status/invoices-payment-status.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatBadgeModule } from "@angular/material/badge";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { DialogConfirmationsModule } from "../dialog-confirmations/dialog-confirmations.module";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  DialogConfirmationsModule,
  FormsModule,
  MatButtonModule,
  MatBadgeModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
  MatTooltipModule,
  PendingIndicatorModule,
  RouterModule,
  ReactiveFormsModule,
  ScrollingModule,
];

@NgModule({
  declarations: [InvoicesPaymentStatusComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [
    CommonModule,
    InvoicesPaymentStatusRoutingModule,
    IMPORT_EXPORT_MODULES,
  ],
  providers: [InvoicesPaymentStatusService],
})
export class InvoicesPaymentStatusModule {}
