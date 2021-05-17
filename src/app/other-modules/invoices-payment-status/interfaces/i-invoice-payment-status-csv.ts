export interface IInvoicePaymentStatusCsv {
  czyCmrOtrzymana: boolean;
  czyFakturaOtrzymana: boolean;
  czyFakturaWyslana: boolean;
  czyFakturaNaBazieTransportu: boolean;
  dataSprzedazy: string;
  dataWystawienia: string;
  dniPrzedawnione: number;
  fakturaSystemId: number;
  fakturaNr: string;
  kontrahentAdres: string;
  kontrahentNazwa: string;
  kontrahentNip: string;
  razemBrutto: string;
  razemNetto: string;
  razemVat: string;
  terminPlatnosci: string;
  terminPlatnosciIleDni: number;
  waluta: string;
}
