export const UI_ROUTES: Routes = [
  {
    path: "kontrahent",
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
    component: InvoiceBuyComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Finanse },
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
    path: "transport",
    component: TransportListComponent,
    canActivate: [IdentGuard],
    data: {
      allowed: UserRolesEnum.Spedytor,
      name: "Transport",
      description: "Rejestr zakupionych transportów i ich statusy",
    },
  },
  {
    path: "transport/:id",
    component: TransportComponent,
    canActivate: [IdentGuard],
    data: { allowed: UserRolesEnum.Spedytor },
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
