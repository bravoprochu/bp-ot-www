import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRolesEnum } from "@bpShared/enums/user-roles.enum";
import { IdentGuard } from "@bpUI/guards/ident.guard";
import { CompanyListComponent } from "./components/company-list/company-list.component";
import { CompanyComponent } from "./components/company/company.component";

const routes: Routes = [
  {
    path: "lista",
    component: CompanyListComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Manager,
      name: "Kontrahenci",
      description: "Baza kontrahentów, tworzenie, modyfikacja danych",
    },
  },
  {
    path: "kontrahent/:id",
    component: CompanyComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Spedytor },
  },
  { path: "", redirectTo: "lista", pathMatch: "full" },
  { path: "**", redirectTo: "kontrahent" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorsRoutingModule {}
