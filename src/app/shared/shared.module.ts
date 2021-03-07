import { TransEuPasswordComponent } from "../ui/trans-eu-password/trans-eu-password.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MainMenuComponent } from "./main-menu/main-menu.component";
import { CreateComponent } from "./create/create.component";
import { TestComponent } from "./test/test.component";
import { ErrorObjectComponent } from "./error-object/error-object.component";
import { InputDialogComponent } from "./input-dialog/input-dialog.component";
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

    TransEuPasswordComponent,
    ErrorObjectComponent,
    InputDialogComponent,
  ],
  entryComponents: [
    ErrorObjectComponent,
    TransEuPasswordComponent,
    InputDialogComponent,
  ],
  providers: [],
  exports: [
    TestComponent,
    MainMenuComponent,
    CreateComponent,

    ErrorObjectComponent,
    InputDialogComponent,
  ],
})
export class SharedModule {
  constructor() {}
}
