import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "app/shared/shared.module";
import { UiModule } from "app/ui/ui.module";
import { HomeComponent } from "./components/home/home.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { CommonFunctionsService } from "app/services/common-functions.service";
import { TokenService } from "./services/token.service";
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
} from "@angular/material";
import { RoutesListModule } from "./other-modules/routes-list/routes-list.module";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatDividerModule,
  MatToolbarModule,
  MatTooltipModule,
  RoutesListModule,
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    IMPORT_EXPORT_MODULES,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    NotFoundComponent,
  ],
  exports: [IMPORT_EXPORT_MODULES],

  providers: [CommonFunctionsService],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   *
   */
  constructor() {}
}
