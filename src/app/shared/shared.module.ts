import { TransEuPasswordComponent } from "../ui/trans-eu-password/trans-eu-password.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { CreateComponent } from "./create/create.component";
import { NavDetailComponent } from "./nav-detail/nav-detail.component";
import { NavListComponent } from "./nav-list/nav-list.component";
import { DialogTakNieComponent } from "./dialog-tak-nie/dialog-tak-nie.component";
import { TestComponent } from "./test/test.component";
import { ErrorObjectComponent } from "./error-object/error-object.component";
import { InputDialogComponent } from "./input-dialog/input-dialog.component";
import { DateRangeComponent } from "./date-range/date-range.component";
import { SharedMaterialMinModule } from "@bpShared/shared-material-min/shared-material-min.module";
import { SharedMaterialRestModule } from "@bpShared/shared-material-rest/shared-material-rest.module";
import { RouterModule } from "@angular/router";

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
    NavDetailComponent,
    NavListComponent,
    DialogTakNieComponent,

    TransEuPasswordComponent,
    ErrorObjectComponent,
    InputDialogComponent,
    DateRangeComponent,
  ],
  entryComponents: [
    DialogTakNieComponent,
    ErrorObjectComponent,
    TransEuPasswordComponent,
    InputDialogComponent,
  ],
  providers: [],
  exports: [
    TestComponent,
    MainMenuComponent,
    CreateComponent,
    NavDetailComponent,
    NavListComponent,
    DialogTakNieComponent,
    ErrorObjectComponent,
    InputDialogComponent,
    DateRangeComponent,
  ],
})
export class SharedModule {
  constructor() {}
}
