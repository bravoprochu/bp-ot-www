import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IInvoiceSellGroupClone } from "app/other-modules/invoices/interfaces/i-invoice-sell-group-clone";
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from "app/services/token.service";
import { environment } from "environments/environment";
import { catchError, take } from "rxjs/operators";

@Injectable()
export class InvoiceSellGroupCloneService extends DataFactoryService {
  constructor(httpClient: HttpClient, tokenService: TokenService) {
    super(environment.apiInvoiceSell, httpClient, tokenService);
  }

  getLastMonthInvoices(monthsAgo: number) {
    return this.http
      .get(`${environment.apiInvoiceSellGetLastMonthInvoices}/${monthsAgo}`, {
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

  postInvoiceListToClone(payload: IInvoiceSellGroupClone) {
    return this.http
      .post(environment.apiinvoicesellPostCloneGroup, payload, {
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
