import { TransportService } from './transport/services/transport.service';
import { TransportComponent } from './transport/transport/transport.component';
import { InvoiceBuyService } from './invoice/invoice-buy/services/invoice-buy.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UiRoutingModule } from 'app/ui/ui-routing.module';
import { AddressComponent } from 'app/ui/address/address.component';
import { CompanyComponent } from 'app/ui/company/company/company.component';
import { CompanyCardComponent } from 'app/ui/company/company-card/company-card.component';
import { CompanyListComponent } from 'app/ui/company/company-list/company-list.component';
import { InvoiceBuyComponent } from 'app/ui/invoice/invoice-buy/invoice-buy/invoice-buy.component';
import { InvoiceBuyListComponent } from 'app/ui/invoice/invoice-buy/invoice-buy-list/invoice-buy-list.component';
import { InvoicePosComponent } from 'app/ui/invoice/common/invoice-pos/invoice-pos.component';
import { InvoicePosResumeComponent } from 'app/ui/invoice/common/invoice-pos-resume/invoice-pos-resume.component';
import { InvoiceSellComponent } from 'app/ui/invoice/invoice-sell/invoice-sell/invoice-sell.component';
import { InvoiceSellListComponent } from 'app/ui/invoice/invoice-sell/invoice-sell-list/invoice-sell-list.component';
import { LoadComponent } from 'app/ui/loads/load/load.component';
import { LoadBuyComponent } from 'app/ui/loads/load-buy/load-buy.component';
import { LoadListComponent } from 'app/ui/loads/load-list/load-list.component';
import { LoadingComponent } from 'app/ui/loads/loading/loading.component';
import { UsersManagementComponent } from 'app/ui/users-management/users-management.component';
import { TokenService } from 'app/services/token.service';
import { CompanyService } from 'app/ui/company/services/company.service';
import { IdentGuard } from 'app/ui/guards/ident.guard';
import { InvoiceSellService } from 'app/ui/invoice/invoice-sell/services/invoice-sell.service';
import { LoadService } from 'app/ui/loads/services/load.service';
import { TranseuService } from 'app/services/transeu/transeu.service';
import { UsersManagementService } from 'app/services/users-management/users-management.service';
import { GeoComponent } from 'app/ui/geo/geo.component';
import { LoadSellComponent } from './loads/load-sell/load-sell.component';
import { LoadTransEuComponent } from './loads/load-trans-eu/load-trans-eu.component';
import { TransportListComponent } from 'app/ui/transport/transport-list/transport-list.component';
import { ExtraInfoCheckedComponent } from './invoice/common/extra-info-checked/extra-info-checked.component';
import { InProgressComponent } from 'app/in-progress/in-progress.component';
import { CreationInfoComponent } from './creation-info/creation-info.component';
import { InvoiceSellPaymentRemindComponent } from './invoice/invoice-sell-payment-remind/invoice-sell-payment-remind.component';
import { PaymentRemindDialogComponent } from './invoice/payment-remind-dialog/payment-remind-dialog.component';
import { InvoiceBuyPaymentRemindComponent } from './invoice/invoice-buy/invoice-buy-payment-remind/invoice-buy-payment-remind.component';
import { InvoiceCommonFunctionsService } from './invoice/common/invoice-common-functions.service';
import { PaymentTermsModule } from '../shared/payment-terms/payment-terms.module';
import { CommonModule } from '@angular/common';
import { SharedMaterialMinModule } from '@bpShared/shared-material-min/shared-material-min.module';
import { SharedMaterialRestModule } from '@bpShared/shared-material-rest/shared-material-rest.module';
import { SharedModule } from '@bpShared/shared.module';
import { CurrencyModule } from '@bpShared/currency/currency.module';
import { TableDragDropOptionsComponent } from './shared/table-drag-drop-options/table-drag-drop-options.component';



@NgModule({

  imports: [
    CommonModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule,
    SharedModule,
    UiRoutingModule,
    HttpClientModule,
    PaymentTermsModule,
    CurrencyModule,
  ],
  declarations: [
    AddressComponent,
    CompanyComponent,
    CompanyCardComponent,
    CompanyListComponent,
    GeoComponent,
    InvoiceBuyComponent,
    InvoiceBuyListComponent,
    InvoicePosComponent,
    InvoicePosResumeComponent,
    InvoiceSellComponent,
    InvoiceSellListComponent,
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
    ExtraInfoCheckedComponent,
    CreationInfoComponent,
    InvoiceSellPaymentRemindComponent,
    PaymentRemindDialogComponent,
    InvoiceBuyPaymentRemindComponent,
    TableDragDropOptionsComponent,
  ],
  providers:[
    HttpClientModule,
    TokenService,
    CompanyService,
    IdentGuard,
    InvoiceSellService,
    InvoiceBuyService,
    LoadService,
    TranseuService,
    TransportService,
    UsersManagementService,
    InvoiceCommonFunctionsService,
  ],
  entryComponents:[
    PaymentRemindDialogComponent
  ],
  exports: [
    AddressComponent,
    CompanyComponent,
    CompanyCardComponent,
    CompanyListComponent,
    GeoComponent,
    InvoiceBuyComponent,
    InvoiceBuyListComponent,
    InvoicePosComponent,
    InvoicePosResumeComponent,
    InvoiceSellComponent,
    InvoiceSellListComponent,
    LoadComponent,
    LoadBuyComponent,
    LoadListComponent,    
    LoadingComponent,
    UsersManagementComponent,
    LoadSellComponent,
    LoadTransEuComponent,
    TransportComponent,
    TransportListComponent,
    ExtraInfoCheckedComponent,
    CreationInfoComponent,
    InvoiceSellPaymentRemindComponent,
    InvoiceBuyPaymentRemindComponent,

  ]
})
export class UiModule { }
