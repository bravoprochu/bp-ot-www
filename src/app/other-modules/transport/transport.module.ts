import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TransportComponent } from "./components/transport/transport.component";
import { TransportListComponent } from "./components/transport-list/transport-list.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TransportService } from "./services/transport.service";
import { NavDetailModule } from "../nav-detail/nav-detail.module";
import { NavListModule } from "../nav-list/nav-list.module";
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
} from "@angular/material";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";
import { CurrencyModule } from "../currency/currency.module";
import { ReactiveFormsModule } from "@angular/forms";
import { ContractorsModule } from "../contractors/contractors.module";
import { PaymentTermsModule } from "../payment-terms/payment-terms.module";
import { MomentCommonModule } from "../moment-common/moment-common.module";
import { TransportRoutingModule } from "./transport-routing.module";
import { CreationInfoModule } from "../creation-info/creation-info.module";

const IMPORT_EXPORT_MODULES = [
  ContractorsModule,
  CreationInfoModule,
  CurrencyModule,
  FlexLayoutModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  NavDetailModule,
  MatFormFieldModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
  MomentCommonModule,
  NavListModule,
  PaymentTermsModule,
  PendingIndicatorModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [TransportComponent, TransportListComponent],
  exports: [IMPORT_EXPORT_MODULES, TransportComponent, TransportListComponent],
  imports: [CommonModule, TransportRoutingModule, IMPORT_EXPORT_MODULES],
  providers: [TransportService],
})
export class TransportModule {}
