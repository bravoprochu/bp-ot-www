import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRolesEnum } from "@bpShared/enums/user-roles.enum";
import { IdentGuard } from "@bpUI/guards/ident.guard";
import { UsersManagementComponent } from "./components/users-management/users-management.component";

const routes: Routes = [
  {
    path: "zarzadzanie-uzytkownikami",
    component: UsersManagementComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Administrator,
      name: "Zarządzenie użytkownikami",
      description:
        "Przypisywanie uprawnień, modyfikacja danych, usuwanie użytkowników",
    },
  },
  { path: "", redirectTo: "zarzadzanie-uzytkownikami", pathMatch: "full" },
  { path: "**", redirectTo: "zarzadzanie-uzytkownikami" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
