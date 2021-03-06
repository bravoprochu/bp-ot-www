import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RoutesListModule } from "./other-modules/routes-list/routes-list.module";
import { UserInfoComponent } from "@bpShared/user-info/user-info.component";
import { LoginComponent } from "./auth/login/login.component";
import { PendingIndicatorModule } from "./other-modules/pending-indicator/pending-indicator.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IdentGuard } from "./ui/guards/ident.guard";
import { ToastMakeModule } from "./other-modules/toast-make/toast-make.module";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTabsModule,
  PendingIndicatorModule,
  RoutesListModule,
  RouterModule,
  ToastMakeModule,
];

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IMPORT_EXPORT_MODULES,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NotFoundComponent,
    UserInfoComponent,
  ],
  exports: [IMPORT_EXPORT_MODULES],
  entryComponents: [LoginComponent],

  providers: [IdentGuard],
  bootstrap: [AppComponent],
})
export class AppModule {
  /**
   *
   */
  constructor() {}
}
