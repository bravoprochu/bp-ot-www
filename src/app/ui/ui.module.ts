import { TransportService } from "./transport/services/transport.service";
import { TransportComponent } from "./transport/transport/transport.component";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { UiRoutingModule } from "app/ui/ui-routing.module";
import { LoadComponent } from "app/ui/loads/load/load.component";
import { LoadBuyComponent } from "app/ui/loads/load-buy/load-buy.component";
import { LoadListComponent } from "app/ui/loads/load-list/load-list.component";
import { LoadingComponent } from "app/ui/loads/loading/loading.component";
import { UsersManagementComponent } from "app/ui/users-management/users-management.component";
import { TokenService } from "app/services/token.service";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { LoadService } from "app/ui/loads/services/load.service";
import { TranseuService } from "app/services/transeu/transeu.service";
import { UsersManagementService } from "app/services/users-management/users-management.service";
import { GeoComponent } from "app/ui/geo/geo.component";
import { LoadSellComponent } from "./loads/load-sell/load-sell.component";
import { LoadTransEuComponent } from "./loads/load-trans-eu/load-trans-eu.component";
import { TransportListComponent } from "app/ui/transport/transport-list/transport-list.component";
import { InProgressComponent } from "app/in-progress/in-progress.component";
import { CreationInfoComponent } from "./creation-info/creation-info.component";
import { InvoiceCommonFunctionsService } from "../other-modules/invoices/common/invoice-common-functions.service";
import { PaymentTermsModule } from "../shared/payment-terms/payment-terms.module";
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
  declarations: [
    GeoComponent,
    InProgressComponent,
    LoadComponent,
    LoadBuyComponent,
    LoadListComponent,
    LoadingComponent,
    UsersManagementComponent,
    LoadSellComponent,
    LoadTransEuComponent,
    TransportComponent,
    TransportListComponent,

    CreationInfoComponent,
  ],
  providers: [
    HttpClientModule,
    TokenService,
    IdentGuard,
    LoadService,
    TranseuService,
    TransportService,
    UsersManagementService,
    InvoiceCommonFunctionsService,
  ],
  entryComponents: [],
  exports: [
    GeoComponent,
    LoadComponent,
    LoadBuyComponent,
    LoadListComponent,
    LoadingComponent,
    UsersManagementComponent,
    LoadSellComponent,
    LoadTransEuComponent,
    TransportComponent,
    TransportListComponent,

    CreationInfoComponent,
  ],
})
export class UiModule {}
