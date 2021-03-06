import { INavRoute } from "../interfaces/i-nav-route";

export const ROUTES_LIST_DATA: INavRoute[] = [
  {
    route: "kontrahent",
    name: "Kontrahenci",
    group: "Kontrahent",
    description: "Baza kontrahentów, tworzenie, modyfikacja danych",
  },
  {
    route: "invoiceSell",
    name: "Faktura sprzedaży",
    group: "Faktury",
    description: "",
  },
  {
    route: "invoiceBuy",
    name: "Faktura zakupu",
    group: "Faktury",
    description: "",
  },
  {
    route: "spedition",
    name: "Spedycja",
    group: "Spedycja",
    description: "Proces od zakupu po sprzedaż",
  },
  {
    route: "transport",
    name: "Transport",
    group: "Transport",
    description: "Rejestr zakupionych transportów i ich statusy",
  },
  {
    route: "user-management",
    name: "Zarządzanie użytkownikami",
    group: "Admin",
    description:
      "Przypisywanie uprawnień, modyfikakcja danych, usuwanie użytkowników",
  },
];
