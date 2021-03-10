import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRolesEnum } from "@bpShared/enums/user-roles.enum";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { InvoicesPaymentStatusComponent } from "./components/invoices-payment-status/invoices-payment-status.component";

const routes: Routes = [
  {
    path: "list",
    component: InvoicesPaymentStatusComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse, name: "Rozliczenie płatności" },
  },

  { path: "", redirectTo: "list", pathMatch: "full" },
  { path: "**", redirectTo: "list" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesPaymentStatusRoutingModule {}
