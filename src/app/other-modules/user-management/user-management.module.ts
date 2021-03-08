import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UsersManagementComponent } from "./components/users-management/users-management.component";
import { UsersManagementService } from "app/services/users-management/users-management.service";
import { NavDetailModule } from "../nav-detail/nav-detail.module";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FlexLayoutModule } from "@angular/flex-layout";
import { UserManagementRoutingModule } from "./user-management-routing.module";
import { PendingIndicatorModule } from "../pending-indicator/pending-indicator.module";

const IMPORT_EXPORT_MODULES = [
  FlexLayoutModule,
  NavDetailModule,
  MatButtonModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  PendingIndicatorModule,
];

@NgModule({
  declarations: [UsersManagementComponent],
  exports: [IMPORT_EXPORT_MODULES],
  imports: [CommonModule, UserManagementRoutingModule, IMPORT_EXPORT_MODULES],
  providers: [UsersManagementService],
})
export class UserManagementModule {}
