import { TokenService } from "./token.service";
import { empty, Observable } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { catchError, take } from "rxjs/operators";

export class DataFactoryService {
  constructor(
    private url = " ",
    protected http: HttpClient,
    protected tokenService: TokenService
  ) {}

  protected bearerHeader() {
    if (this.tokenService.isLoggedIn) {
      return new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", "Bearer " + this.tokenService.getToken().token);
    }
  }

  getAll(dateRange?: IDateRange): Observable<any> {
    if (dateRange) {
      const START = new Date(dateRange.dateStart).toISOString().slice(0, 10);
      const END = new Date(dateRange.dateEnd).toISOString().slice(0, 10);
      const URI = encodeURI(`${this.url}/GetAll/${START}/${END}`);

      return this.http
        .get(URI, {
          headers: this.bearerHeader(),
        })
        .pipe(take(1), catchError(this.errorHandler));
    } else {
      return this.http
        .get(this.url + "/GetAll", { headers: this.bearerHeader() })
        .pipe(take(1), catchError(this.errorHandler));
    }
  }

  getAllRanged(dateRange?: IDateRange): Observable<any> {
    if (dateRange) {
      // const START = new Date(dateRange.dateStart).toISOString().slice(0, 10);
      // const END = new Date(dateRange.dateEnd).toISOString().slice(0, 10);
      // const URI = encodeURI(`${this.url}/GetAll/${START}/${END}`);

      return (
        this.http
          // .get(URI, {
          //   headers: this.bearerHeader(),
          // })
          .post(`${this.url}/GetAll`, dateRange, {
            headers: this.bearerHeader(),
          })
          .pipe(take(1), catchError(this.errorHandler))
      );
    } else {
      return this.http
        .get(this.url + "/GetAll", { headers: this.bearerHeader() })
        .pipe(take(1), catchError(this.errorHandler));
    }
  }

  getById(id: number): Observable<any> {
    return this.http
      .get(this.url + "/GetById/" + id, { headers: this.bearerHeader() })
      .pipe(take(1), catchError(this.errorHandler));
  }

  create(item: any): Observable<any> {
    return this.http
      .post(this.url + "/Post", item, { headers: this.bearerHeader() })
      .pipe(take(1), catchError(this.errorHandler));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete(this.url + "/Delete/" + id, { headers: this.bearerHeader() })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err && err.error && err.error.warning) {
            this.tokenService.message(err.error.warning, "warning", 7000);
          }
          return empty();
        }),
        take(1)
      );
  }

  update(id: number, item: any): Observable<any> {
    return this.http
      .put(this.url + "/Put/" + id, JSON.stringify(item), {
        headers: this.bearerHeader(),
      })
      .pipe(take(1), catchError(this.errorHandler));
  }

  protected errorHandler(error: Response) {
    return Observable.throw(error);
  }
}
