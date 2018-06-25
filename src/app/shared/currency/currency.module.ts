import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyListComponent } from './currency-list/currency-list.component';
import { SharedMaterialMinModule } from '@bpShared/shared-material-min/shared-material-min.module';
import { SharedMaterialRestModule } from '@bpShared/shared-material-rest/shared-material-rest.module';
import { CurrencyCommonService } from './currency-common.service';
import { CurrencyNbpComponent } from './currency-nbp/currency-nbp.component';
import { MomentCommonModule } from '@bpShared/moment-common/moment-common.module';

@NgModule({
  imports: [
    CommonModule,
    MomentCommonModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule
  ],
  declarations: 
    [
      CurrencyListComponent,
      CurrencyNbpComponent
    ],
    exports: [
      CurrencyListComponent,
      CurrencyNbpComponent
    ],
    providers:[
    CurrencyCommonService
  ]
})
export class CurrencyModule { }
