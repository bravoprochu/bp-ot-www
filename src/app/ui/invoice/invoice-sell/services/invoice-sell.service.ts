import { TokenService } from '../../../../services/token.service';
import { IInvoiceSell, IInvoiceLineGroup } from '../../interfaces/iinvoice-sell';
import { DataFactoryService } from '../../../../services/data-factory.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IInvoiceSellGroupClone } from '@bpUI/invoice/interfaces/i-invoice-sell-group-clone';

@Injectable()
export class InvoiceSellService extends DataFactoryService {

  constructor(
    httpClient: HttpClient,
    tokenService: TokenService,
  ) {
    super(environment.apiInvoiceSell, httpClient, tokenService)
 }



 calcLineGroup(invoice:IInvoiceLineGroup):Observable<any>{
  return this.http.post(environment.apiInvoiceSellCalcLineGroup, invoice, {
    headers: this.bearerHeader()
  })
  .take(1)
  .catch(err=> {
   return Observable.of("error");
 })    
}


 calcRates(invoice:IInvoiceSell):Observable<any>{
   return this.http.post(environment.apiInvoiceSellCalcRates, invoice, {
     headers: this.bearerHeader()
   })
   .take(1)
   .catch(err=> {
    return Observable.of("error");
  })    
  }

  getLastMonthInvoices(monthsAgo:number) {
    return this.http.get(`${environment.apiInvoiceSellGetLastMonthInvoices}/${monthsAgo}`, {
      headers: this.bearerHeader()
    })
    .take(1)
    .catch(this.errorHandler);
  }


 printInvoice(invoice: IInvoiceSell):Observable<any>{
  return this.http.post(environment.apiInvoiceSellGenInvoicePdf, invoice, {
    headers: this.bearerHeader(), responseType: 'blob'
  })
  .take(1)
  .catch(this.errorHandler);
 }

 paymentConfirmation(id:number, paymentDate:string): Observable<any>
 {
   return this.http.get(`${environment.apiInvoiceSellPaymentConfirmation}/${id}/${paymentDate}`, {
     headers: this.bearerHeader()
   })
   .take(1)
   .catch(this.errorHandler);
 }

 paymentRemind():Observable<any>
 {
  return this.http.get(environment.apiInvoiceSellPaymentRemind, {
    headers: this.bearerHeader()
  })
  .take(1)
  .catch(this.errorHandler);
 }

 postInvoiceListToClone(payload: IInvoiceSellGroupClone){
   return this.http.post(environment.apiinvoicesellPostCloneGroup, payload, {
     headers: this.bearerHeader()
   })
   .take(1)
   .catch(this.errorHandler);

 }

 


}
