import { TransEuPasswordComponent } from '../ui/trans-eu-password/trans-eu-password.component';
import { LoginComponent } from '../auth/login/login.component';
import { RouteListComponent } from './route-list/route-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CreateComponent } from './create/create.component';
import { PendingComponent } from './pending/pending.component';
import { NavDetailComponent } from './nav-detail/nav-detail.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { DialogTakNieComponent } from './dialog-tak-nie/dialog-tak-nie.component';
import { TestComponent } from './test/test.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ErrorObjectComponent } from './error-object/error-object.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { SharedMaterialMinModule } from '@bpShared/shared-material-min/shared-material-min.module';
import { SharedMaterialRestModule } from '@bpShared/shared-material-rest/shared-material-rest.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule,
  ],
  declarations: [
    TestComponent,
    MainMenuComponent, 
    CreateComponent, 
    PendingComponent, 
    NavDetailComponent, 
    NavListComponent, 
    DialogTakNieComponent,
    LoginComponent,
    TransEuPasswordComponent,    
    RouteListComponent,
    UserInfoComponent,
    ErrorObjectComponent,
    InputDialogComponent,
    DateRangeComponent,
  ],
  entryComponents:[
    RouteListComponent,
    DialogTakNieComponent,
    ErrorObjectComponent,
    LoginComponent,
    TransEuPasswordComponent,
    InputDialogComponent
  ],
  providers:[
  ],
  exports:[
    TestComponent,
    RouteListComponent,
    MainMenuComponent,
    CreateComponent,
    PendingComponent,
    NavDetailComponent,
    NavListComponent,
    DialogTakNieComponent,
    UserInfoComponent,
    ErrorObjectComponent,
    InputDialogComponent,
    DateRangeComponent
  ],
})



export class SharedModule {
  constructor(){
 }

}


