const server='https://bp-kpir-api.azurewebsites.net/'

export const environment = {
  production: true,
  appName: "bp-KPIR-test",
  
  apiUrlCompanyCard:server+'kontrahent',
  
    apiUrlNbpSredniZDnia: '//api.nbp.pl/api/exchangerates/rates/a/',
  
    apiInvoiceBuy: server+'api/invoiceBuy',
    apiInvoiceBuyCalcRates: server+'api/invoiceBuy/PostCalcRates',
    apiInvoiceBuyPaymentConfirmation: server + 'api/invoiceBuy/SetPaymentConfirmation',
    apiInvoiceBuyPaymentRemind: server+'api/invoiceBuy/GetPaymentRemindList',
    apiInvoiceSell: server+'api/invoiceSell',
    apiInvoiceSellCalcRates: server+'api/invoiceSell/PostCalcRates',
    apiInvoiceSellGenInvoicePdf: server+'api/invoiceSell/GenInvoicePdf',
    apiInvoiceSellPaymentConfirmation: server +'api/invoiceSell/SetPaymentConfirmation',
    apiInvoiceSellPaymentRemind: server+'api/invoiceSell/GetPaymentRemindList',
    apiInvoiceSellPaymentRemindByDate: server+'api/invoiceSell/GetPaymentRemindByDateList',
    apiUrlLoad: server+'api/load',
    apiUrlLoadGenPdf: server+'api/load/getOrderPdf',
    apiUrlLoadInvoiceSellGet: server+'api/load/loadInvoiceSellGen/',
    apiUrlLoadUpdatBuy: server+'api/load/updateBuy/',
    apiUrlLoadUpdateTransEu: server+'api/load/updateTransEu/',
    apiUrlLoadUpdateSell: server+'api/load/updateSell/',
    apiUrlToken: server+'token',
    apiUrlCompany: server+'api/company',
    apiUrlTransportOffer: server+'api/transportOffer',
    apiUrlTransportOfferInvoiceSellGen: server+'api/transportOffer/invoiceSellGen/',
    apiRegisterUser: server+'account/register',
    apiTransEuAuthServer: 'https://auth.system.trans.eu/oauth2/token',
    getTransEuEmployeeList: server+"api/transEu/companyEmployeeList",
    apiTransEuKontrahentById: server+"api/transEu/kontrahentById",
    apiTransEuLoads: server+"api/transEu/loads",
    apiTransEuAppCreds: server+ 'transEu/GetTransEuAppCreds',
    apiUsersManagement: server+'api/usersManagement',
};


export const DEFAULT_APP_VALUES = {
  routeParamName: "id",
  dateLocalFormat: "YYYY-MM-DD",
  defaultConstHour: 9,
}