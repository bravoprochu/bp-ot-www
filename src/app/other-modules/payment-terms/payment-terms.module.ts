import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaymentTermsService } from "./services/payment-terms.service";
import { PaymentTermsComponent } from "./components/payment-terms/payment-terms.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { Platform, PlatformModule } from "@angular/cdk/platform";
import { CustomDateAdapterPl } from "app/common-functions/angular-datepicker/custom-date-adapter-pl";

const IMPORT_EXPORT_MODULES = [
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  PlatformModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [PaymentTermsComponent],
  exports: [IMPORT_EXPORT_MODULES, PaymentTermsComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  providers: [
    PaymentTermsService,
    { provide: MAT_DATE_LOCALE, useValue: "pl-PL" },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapterPl,
      deps: [MAT_DATE_LOCALE, Platform],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
})
export class PaymentTermsModule {}
