import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentTermsComponent } from "./payment-terms/payment-terms.component";
import { PaymentTermsService } from "./payment-terms.service";
import { MomentCommonModule } from "@bpShared/moment-common/moment-common.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import {
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
} from "@angular/material";

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
