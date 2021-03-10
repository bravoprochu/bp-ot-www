import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from "app/services/token.service";
import { environment } from "environments/environment";
import { Observable } from "rxjs";
import { catchError, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class InvoicesPaymentStatusService extends DataFactoryService {
  constructor(httpClient: HttpClient, tokenService: TokenService) {
    super(environment.apiInvoiceSell, httpClient, tokenService);
  }

  paymentConfirmation(id: number, paymentDate: string): Observable<any> {
    return this.http
      .get(
        `${environment.apiInvoiceSellPaymentConfirmation}/${id}/${paymentDate}`,
        {
          headers: this.bearerHeader(),
        }
      )
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
