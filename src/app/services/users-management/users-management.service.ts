import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from "app/services/token.service";
import { environment } from "environments/environment";
import { IusersManagement } from "app/shared/interfaces/iusers-management";
import { delay, retryWhen, take } from "rxjs/operators";

@Injectable()
export class UsersManagementService extends DataFactoryService {
  constructor(http: HttpClient, tokenService: TokenService) {
    super(environment.apiUsersManagement, http, tokenService);
  }

  updatePackage(usersManagemetn: IusersManagement): Observable<any> {
    return this.http
      .post(environment.apiUsersManagement + "/update", usersManagemetn, {
        headers: this.bearerHeader(),
      })
      .pipe(
        take(1),
        retryWhen((errors) => errors.pipe(delay(2500), take(3)))
      );
  }
}
