import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { UiRoutingModule } from "app/ui/ui-routing.module";
import { TokenService } from "app/services/token.service";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { LoadService } from "app/ui/loads/services/load.service";
import { TranseuService } from "app/services/transeu/transeu.service";
import { UsersManagementService } from "app/services/users-management/users-management.service";
import { InvoiceCommonFunctionsService } from "../other-modules/invoices/common/invoice-common-functions.service";
import { PaymentTermsModule } from "../other-modules/payment-terms/payment-terms.module";
import { CommonModule } from "@angular/common";
import { SharedMaterialMinModule } from "@bpShared/shared-material-min/shared-material-min.module";
import { SharedMaterialRestModule } from "@bpShared/shared-material-rest/shared-material-rest.module";
import { SharedModule } from "@bpShared/shared.module";
import { CurrencyModule } from "app/other-modules/currency/currency.module";

const IMPORT_EXPORT_MODULES = [
  UiRoutingModule,
  HttpClientModule,
  PaymentTermsModule,
  CurrencyModule,
];

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule,
    SharedModule,
  ],
  declarations: [],
  providers: [
    HttpClientModule,
    TokenService,
    IdentGuard,
    LoadService,
    TranseuService,
    UsersManagementService,
    InvoiceCommonFunctionsService,
  ],
  entryComponents: [],
  exports: [],
})
export class UiModule {}
