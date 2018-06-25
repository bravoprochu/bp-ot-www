import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from "app/shared/shared.module";
import { UiModule } from "app/ui/ui.module";
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CommonFunctionsService } from "app/services/common-functions.service";
import { SharedMaterialMinModule } from './shared/shared-material-min/shared-material-min.module';
import { SharedMaterialRestModule } from './shared/shared-material-rest/shared-material-rest.module';
import { TokenService } from './services/token.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedMaterialMinModule,
    SharedMaterialRestModule,
    SharedModule,
    
    UiModule,

  ],
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NotFoundComponent,
  ],
  exports:[
  ],

  providers: [
      CommonFunctionsService,
      TokenService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
/**
 *
 */
constructor() {
    
}

}
