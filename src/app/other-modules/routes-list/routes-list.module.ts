import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouteListComponent } from "./components/route-list/route-list.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TokenService } from "app/services/token.service";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  ReactiveFormsModule,
  RouterModule,
];

@NgModule({
  declarations: [RouteListComponent],
  imports: [CommonModule, IMPORT_EXPORT_MODULES],
  entryComponents: [RouteListComponent],
  exports: [IMPORT_EXPORT_MODULES, RouteListComponent],
  providers: [TokenService],
})
export class RoutesListModule {}
