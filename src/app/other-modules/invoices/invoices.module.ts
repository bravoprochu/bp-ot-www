import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoicesRoutingModule } from "./invoices-routing.module";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InvoiceSellComponent } from "./invoice-sell/invoice-sell/invoice-sell.component";
import { ExtraInfoCheckedComponent } from "./common/extra-info-checked/extra-info-checked.component";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { InvoiceSellGroupCloneComponent } from "./invoice-sell/invoice-sell-group-clone/invoice-sell-group-clone.component";
import { InvoiceSellListComponent } from "./invoice-sell/invoice-sell-list/invoice-sell-list.component";
import { InvoiceSellPaymentRemindComponent } from "./invoice-sell-payment-remind/invoice-sell-payment-remind.component";
import { PaymentRemindDialogComponent } from "./payment-remind-dialog/payment-remind-dialog.component";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { ContractorsModule } from "../contractors/contractors.module";
import { DragDropOptionsModule } from "../drag-drop-options/drag-drop-options.module";
import { InvoicePosComponent } from "./common/invoice-pos/invoice-pos.component";
import { InvoicePosResumeComponent } from "./common/invoice-pos-resume/invoice-pos-resume.component";
import { DateRangeModule } from "../date-range/date-range.module";
import { InvoiceSellService } from "./invoice-sell/services/invoice-sell.service";
import { InvoiceBuyService } from "./invoice-buy/services/invoice-buy.service";
import { ToastMakeModule } from "../toast-make/toast-make.module";
import { NavDetailModule } from "../nav-detail/nav-detail.module";
import { NavListModule } from "../nav-list/nav-list.module";
import { InvoiceCommonFunctionsService } from "./common/invoice-common-functions.service";
import { InvoiceBuyListComponent } from "./invoice-buy/invoice-buy-list/invoice-buy-list.component";
import { InvoiceBuyComponent } from "./invoice-buy/invoice-buy/invoice-buy.component";
import { DialogTakNieModule } from "../dialog-tak-nie/dialog-tak-nie.module";
import { MomentCommonModule } from "../moment-common/moment-common.module";
import { CreationInfoModule } from "../creation-info/creation-info.module";

const IMPORT_EXPORT_MODULES = [
  ContractorsModule,
  CreationInfoModule,
  CurrencyModule,
  DateRangeModule,
  DialogTakNieModule,
  DragDropOptionsModule,
  FlexLayoutModule,
  FormsModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatExpansionModule,
  MatPaginatorModule,
  MatTabsModule,
  MatTableModule,
  MomentCommonModule,
  NavDetailModule,
  NavListModule,
  PendingIndicatorModule,
  PaymentTermsModule,
  ReactiveFormsModule,
  ToastMakeModule,
];

@NgModule({
  declarations: [
    ExtraInfoCheckedComponent,
    InvoicePosComponent,
    InvoicePosResumeComponent,
    InvoiceBuyComponent,
    InvoiceBuyListComponent,
    InvoiceSellComponent,
    InvoiceSellListComponent,
    InvoiceSellGroupCloneComponent,
    InvoiceSellPaymentRemindComponent,
    PaymentRemindDialogComponent,
  ],
  entryComponents: [PaymentRemindDialogComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [CommonModule, InvoicesRoutingModule, IMPORT_EXPORT_MODULES],
  providers: [
    InvoiceCommonFunctionsService,
    InvoiceSellService,
    InvoiceBuyService,
  ],
})
export class InvoicesModule {}
