import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InvoiceSellPaymentRemindComponent } from "app/other-modules/invoices/invoice-sell-payment-remind/invoice-sell-payment-remind.component";
import { IdentGuard } from "app/ui/guards/ident.guard";
import { LoadListComponent } from "app/ui/loads/load-list/load-list.component";
import { LoadComponent } from "app/ui/loads/load/load.component";
import { UserRolesEnum } from "../shared/enums/user-roles.enum";
import { UsersManagementComponent } from "../other-modules/user-management/components/users-management/users-management.component";

export const uiRoutes: Routes = [
  {
    path: "ladunek",
    component: LoadListComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Spedytor,
      name: "Spedycja",
      description: "Proces od zakupu, publikacji na giełdzie przez sprzedaż",
    },
  },
  {
    path: "ladunek/:id",
    component: LoadComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Spedytor },
  },
  {
    path: "rozliczeniaSprzedaz",
    component: InvoiceSellPaymentRemindComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Finanse,
      name: "Finanse - rozliczenia",
      description: "Rozliczenie faktur sprzedaży",
    },
  },
  {
    path: "ZarzadzanieUzytkownikami",
    component: UsersManagementComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Administrator,
      name: "Zarządzenie użytkownikami",
      description:
        "Przypisywanie uprawnień, modyfikacja danych, usuwanie użytkowników",
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(uiRoutes)],
  exports: [RouterModule],
})
export class UiRoutingModule {}
