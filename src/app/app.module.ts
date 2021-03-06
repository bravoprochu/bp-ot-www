import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from "@angular/material";
import { RoutesListModule } from "./other-modules/routes-list/routes-list.module";
import { UserInfoComponent } from "@bpShared/user-info/user-info.component";
import { LoginComponent } from "./auth/login/login.component";
import { PendingIndicatorModule } from "./other-modules/pending-indicator/pending-indicator.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IdentGuard } from "@bpUI/guards/ident.guard";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatDialogModule,
  MatDividerModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTabsModule,
  PendingIndicatorModule,
  RoutesListModule,
  RouterModule,
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
