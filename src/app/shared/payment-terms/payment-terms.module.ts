import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { SharedMaterialMinModule } from '@bpMaterialMin/shared-material-min.module';
import { SharedMaterialRestModule } from '@bpMaterialRest/shared-material-rest.module';
import { PaymentTermsService } from './payment-terms.service';
import { MomentCommonModule } from '@bpShared/moment-common/moment-common.module';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule,
    MomentCommonModule,
  ],
  declarations: [
    PaymentTermsComponent
  ],
  exports:[
    PaymentTermsComponent
  ],
  providers: [
    PaymentTermsService
  ]
})
export class PaymentTermsModule { }
