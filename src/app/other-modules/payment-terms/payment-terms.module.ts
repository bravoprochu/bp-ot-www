import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentTermsComponent } from "./payment-terms/payment-terms.component";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { PaymentTermsService } from "./services/payment-terms.service";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatDatepickerModule,
  MatInputModule,
  MatIconModule,
  MatSelectModule,
  MomentCommonModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  declarations: [PaymentTermsComponent],
  exports: [IMPORT_EXPORT_MODULES, PaymentTermsComponent],
  providers: [PaymentTermsService],
})
export class PaymentTermsModule {}
