import { TokenService } from "../../../services/token.service";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { ILoad } from "app/shared/interfaces/iload";
import { catchError, take } from "rxjs/operators";

@Injectable()
export class LoadService extends DataFactoryService {
  constructor(http: HttpClient, tokenService: TokenService) {
    super(environment.apiUrlLoad, http, tokenService);
  }

  getLoads(): Observable<any> {
    return this.http
      .get(environment.apiTransEuLoads, { headers: this.bearerHeader() })
      .pipe(take(1), catchError(this.errorHandler));
  }

  genPdf(load: ILoad): Observable<any> {
    return this.http
      .post(environment.apiUrlLoadGenPdf, load, {
        headers: this.bearerHeader(),
        responseType: "blob",
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  loadInvoiceSellGen(id: number): Observable<any> {
    return this.http
      .get(environment.apiUrlLoadInvoiceSellGet + id, {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  updateBuy(id: number, load: ILoad): Observable<any> {
    return this.http
      .put(environment.apiUrlLoadUpdatBuy + id, JSON.stringify(load), {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  updateTransEu(id: number, load: ILoad): Observable<any> {
    return this.http
      .put(environment.apiUrlLoadUpdateTransEu + id, JSON.stringify(load), {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  updateSell(id: number, load: ILoad): Observable<any> {
    return this.http
      .put(environment.apiUrlLoadUpdateSell + id, JSON.stringify(load), {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }
}
