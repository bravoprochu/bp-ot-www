import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRolesEnum } from "@bpShared/enums/user-roles.enum";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { InvoiceBuyListComponent } from "./invoice-buy/invoice-buy-list/invoice-buy-list.component";
import { InvoiceSellListComponent } from "./invoice-sell/invoice-sell-list/invoice-sell-list.component";
import { InvoiceSellComponent } from "./invoice-sell/invoice-sell/invoice-sell.component";

const routes: Routes = [
  {
    path: "fakturaSprzedazy",
    component: InvoiceSellListComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse, name: "Faktura sprzedaży" },
  },
  {
    path: "fakturaSprzedazy/:id",
    component: InvoiceSellComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse },
  },
  {
    path: "fakturaZakupu",
    component: InvoiceBuyListComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse, name: "Faktura zakupu" },
  },
  {
    path: "fakturaZakupu/:id",
    component: InvoiceSellComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse },
  },

  { path: "", redirectTo: "fakturaSprzedazy", pathMatch: "full" },
  { path: "**", redirectTo: "fakturaSprzedazy" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {}
