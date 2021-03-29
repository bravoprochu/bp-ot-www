import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from "app/services/token.service";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { catchError, take } from "rxjs/operators";
import { IInvoiceStatusConfirmation } from "../interfaces/i-invoice-status-confirmation";

@Injectable({
  providedIn: "root",
})
export class InvoicesPaymentStatusService extends DataFactoryService {
  constructor(httpClient: HttpClient, tokenService: TokenService) {
    super(environment.apiInvoiceSell, httpClient, tokenService);
  }

  confirmation(
    id: number,
    payload: IInvoiceStatusConfirmation
  ): Observable<any> {
    return this.http
      .put(`${environment.apiInvoiceSellConfirmation}/${id}`, payload, {
        headers: this.bearerHeader(),
      })
      .pipe(
        take(1),
        catchError((err) => {
          console.log(err);
          return err;
        })
      );
  }

  paymentRemind(): Observable<any> {
    return this.http
      .get(environment.apiInvoiceSellPaymentRemind, {
        headers: this.bearerHeader(),
      })
      .pipe(
        take(1),
        catchError((err) => {
          console.log(err);
          return err;
        })
      );
  }
}
