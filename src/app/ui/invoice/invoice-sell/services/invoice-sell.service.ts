import { TokenService } from '../../../../services/token.service';
import { IInvoiceSell } from '../../../../shared/interfaces/iinvoice-sell';
import { DataFactoryService } from '../../../../services/data-factory.service';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';


@Injectable()
export class InvoiceSellService extends DataFactoryService {

  constructor(
    httpClient: HttpClient,
    tokenService: TokenService,
  ) {
    super(environment.apiInvoiceSell, httpClient, tokenService)
 }


 calcRates(invoice:IInvoiceSell):Observable<any>{
   return this.http.post(environment.apiInvoiceSellCalcRates, invoice, {
     headers: this.bearerHeader()
   })
   .take(1)
   .catch(err=> {
    return Observable.of("error");
  })
   //.catch(this.errorHandler);
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


 


}
