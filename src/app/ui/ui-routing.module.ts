import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from 'app/ui/company/company-list/company-list.component';
import { CompanyComponent } from 'app/ui/company/company/company.component';
import { IdentGuard } from 'app/ui/guards/ident.guard';
import { InvoiceBuyListComponent } from 'app/ui/invoice/invoice-buy/invoice-buy-list/invoice-buy-list.component';
import { InvoiceBuyComponent } from 'app/ui/invoice/invoice-buy/invoice-buy/invoice-buy.component';
import { InvoiceSellListComponent } from 'app/ui/invoice/invoice-sell/invoice-sell-list/invoice-sell-list.component';
import { InvoiceSellComponent } from 'app/ui/invoice/invoice-sell/invoice-sell/invoice-sell.component';
import { LoadListComponent } from 'app/ui/loads/load-list/load-list.component';
import { LoadComponent } from 'app/ui/loads/load/load.component';
import { TransportListComponent } from 'app/ui/transport/transport-list/transport-list.component';
import { TransportComponent } from 'app/ui/transport/transport/transport.component';

import { UserRolesEnum } from '../shared/enums/user-roles.enum';
import { UsersManagementComponent } from './users-management/users-management.component';
import { InvoiceSellPaymentRemindComponent } from 'app/ui/invoice/invoice-sell-payment-remind/invoice-sell-payment-remind.component';




export const uiRoutes: Routes = [
  // {
  //   path: "",
  //   component: InvoiceSellComponent,
  //   children:[


  //   ]
  // },
  { path: 'kontrahent', component: CompanyListComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Manager, name: "Kontrahenci", description: "Baza kontrahentów, tworzenie, modyfikacja danych"}},
  { path: 'kontrahent/:id', component: CompanyComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Spedytor}},
  { path: 'ladunek', component: LoadListComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Spedytor, name: "Spedycja", description: "Proces od zakupu, publikacji na giełdzie przez sprzedaż"}},
  { path: 'ladunek/:id', component: LoadComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Spedytor} },
  { path: 'fakturaSprzedazy', component: InvoiceSellListComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Finanse, name: "Faktura sprzedaży"}},
  { path: 'fakturaSprzedazy/:id', component: InvoiceSellComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Finanse} },
  { path: 'fakturaZakupu', component: InvoiceBuyListComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Finanse, name: "Faktura zakupu"}},
  { path: 'fakturaZakupu/:id', component: InvoiceBuyComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Finanse} },
  { path: 'rozliczeniaSprzedaz', component: InvoiceSellPaymentRemindComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Finanse, name: "Finanse - rozliczenia", description: "Rozliczenie faktur sprzedaży" }},
  { path: 'transport', component: TransportListComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Spedytor, name: "Transport", description: "Rejestr zakupionych transportów i ich statusy"}},
  { path: 'transport/:id', component: TransportComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Spedytor} },
  { path: 'ZarzadzanieUzytkownikami', component: UsersManagementComponent, canActivate:[IdentGuard], data: {allowed: UserRolesEnum.Administrator, name: "Zarządzenie użytkownikami", description:"Przypisywanie uprawnień, modyfikacja danych, usuwanie użytkowników"}},
  

  // { path:'', redirectTo: '/company', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(uiRoutes)],
  exports: [RouterModule]
})
export class UiRoutingModule { }
