import { INavRoute } from "../interfaces/i-nav-route";

export const ROUTES_LIST_DATA: INavRoute[] = [
  {
    route: "contractors/lista",
    name: "Kontrahenci",
    group: "Kontrahent",
    description: "Baza kontrahentów, tworzenie, modyfikacja danych",
  },
  {
    route: "invoices/fakturaSprzedazy",
    name: "Faktura sprzedaży",
    group: "Faktury",
    description: "",
  },
  {
    route: "invoices/fakturaZakupu",
    name: "Faktura zakupu",
    group: "Faktury",
    description: "",
  },
  {
    route: "invoices-status",
    name: "Rozliczenie płatności",
    group: "Faktury",
    description: "",
  },
  // {
  //   route: "spedition",
  //   name: "Spedycja",
  //   group: "Spedycja",
  //   description: "Proces od zakupu po sprzedaż",
  // },
  {
    route: "transport/lista",
    name: "Transport",
    group: "Transport",
    description: "Rejestr zakupionych transportów i ich statusy",
  },
  {
    route: "user-management/zarzadzanie-uzytkownikami",
    name: "Zarządzanie użytkownikami",
    group: "Admin",
    description:
      "Przypisywanie uprawnień, modyfikakcja danych, usuwanie użytkowników",
  },
];
