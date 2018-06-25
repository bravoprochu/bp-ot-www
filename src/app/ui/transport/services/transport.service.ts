import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFactoryService } from 'app/services/data-factory.service';
import { environment } from 'environments/environment';
import { TokenService } from 'app/services/token.service';

@Injectable()
export class TransportService extends DataFactoryService {

  constructor(
    public http: HttpClient,
    private token: TokenService,
  ) {
    super(environment.apiUrlTransportOffer, http, token);
  }

  invoiceSellGen(id: number, invoiceInPLN: boolean): Observable<any> {
    return this.http.get(environment.apiUrlTransportOfferInvoiceSellGen + id + "/" + invoiceInPLN,
      { headers: this.bearerHeader() })
      .take(1)
      .catch(this.errorHandler)
  }
}
