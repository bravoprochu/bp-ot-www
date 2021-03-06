import { environment } from "../../../../../environments/environment";
import { TokenService } from "../../../../services/token.service";
import { HttpClient } from "@angular/common/http";
import { DataFactoryService } from "../../../../services/data-factory.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IInvoiceBuy } from "../../interfaces/iinvoice-buy";
import { catchError, take } from "rxjs/operators";

@Injectable()
export class InvoiceBuyService extends DataFactoryService {
  constructor(
    private httpClient: HttpClient,
    public tokenService: TokenService
  ) {
    super(environment.apiInvoiceBuy, httpClient, tokenService);
  }

  calcRates(invoice: IInvoiceBuy): Observable<any> {
    return this.http
      .post(environment.apiInvoiceBuyCalcRates, invoice, {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  paymentConfirmation(id: number, paymentDate: string): Observable<any> {
    return this.http
      .get(
        `${environment.apiInvoiceBuyPaymentConfirmation}/${id}/${paymentDate}`,
        {
          headers: this.bearerHeader(),
        }
      )
      .pipe(take(1), catchError(this.errorHandler));
  }

  paymentRemind(): Observable<any> {
    return this.http
      .get(environment.apiInvoiceBuyPaymentRemind, {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }
}
