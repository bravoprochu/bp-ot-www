// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// const server='https://offertrans-sped-api.azurewebsites.net/'
const server = "http://localhost:5000/";

export const environment = {
  production: false,
  appName: "bp-bridge - dev",
  apiUrlCompanyCard: server + "kontrahent",

  apiUrlNbpSredniZDnia: "//api.nbp.pl/api/exchangerates/rates/a/",
  apiInvoiceBuy: server + "api/invoiceBuy",
  apiInvoiceBuyCalcLineGroup: server + "api/invoiceBuy/PostCalcLineGroup",
  apiInvoiceBuyCalcRates: server + "api/invoiceBuy/PostCalcRates",
  apiInvoiceBuyPaymentConfirmation:
    server + "api/invoiceBuy/SetPaymentConfirmation",
  apiInvoiceBuyPaymentRemind: server + "api/invoiceBuy/GetPaymentRemindList",
  apiInvoiceSell: server + "api/invoiceSell",
  apiInvoiceSellCalcLineGroup: server + "api/invoiceSell/PostCalcLineGroup",
  apiInvoiceSellCalcRates: server + "api/invoiceSell/PostCalcRates",
  apiInvoiceSellGenInvoicePdf: server + "api/invoiceSell/GenInvoicePdf",
  apiInvoiceSellGetLastMonthInvoices: `${server}api/invoiceSell/GetLastMonthInvoices`,
  apiInvoiceSellConfirmation: server + "api/invoiceSell/SetConfirmation",
  apiInvoiceSellPaymentRemind: server + "api/invoiceSell/GetPaymentRemindList",
  apiInvoiceSellPaymentRemindByDate:
    server + "api/invoiceSell/GetPaymentRemindByDateList",
  apiinvoicesellPostCloneGroup: `${server}api/invoiceSell/PostCloneGroup`,
  apiUrlLoad: server + "api/load",
  apiUrlLoadGenPdf: server + "api/load/getOrderPdf",
  apiUrlLoadInvoiceSellGet: server + "api/load/loadInvoiceSellGen/",
  apiUrlLoadUpdatBuy: server + "api/load/updateBuy/",
  apiUrlLoadUpdateTransEu: server + "api/load/updateTransEu/",
  apiUrlLoadUpdateSell: server + "api/load/updateSell/",
  apiUrlToken: server + "token",
  apiUrlCompany: server + "api/company",
  apiUrlTransportOffer: server + "api/transportOffer",
  apiUrlTransportOfferInvoiceSellGen:
    server + "api/transportOffer/invoiceSellGen/",
  apiRegisterUser: server + "account/register",
  apiTransEuAuthServer: "https://auth.system.trans.eu/oauth2/token",
  getTransEuEmployeeList: server + "api/transEu/companyEmployeeList",
  apiTransEuKontrahentById: server + "api/transEu/kontrahentById",
  apiTransEuLoads: server + "api/transEu/loads",
  apiTransEuAppCreds: server + "transEu/GetTransEuAppCreds",

  apiUsersManagement: server + "api/usersManagement",
};

export const DEFAULT_APP_VALUES = {
  routeParamName: "id",
  dateLocalFormat: "YYYY-MM-DD",
  defaultConstHour: 0,
};
