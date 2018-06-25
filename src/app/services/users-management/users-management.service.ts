import { HttpResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFactoryService } from 'app/services/data-factory.service';
import { TokenService } from 'app/services/token.service';
import { environment } from 'environments/environment';
import { IusersManagement } from 'app/shared/interfaces/iusers-management';

@Injectable()
export class UsersManagementService extends DataFactoryService {

  constructor(http: HttpClient, tokenService: TokenService) {
    super(environment.apiUsersManagement, http, tokenService)
   }

   
   updatePackage(usersManagemetn: IusersManagement):Observable<any>{
     return this.http.post(environment.apiUsersManagement+"/update", usersManagemetn, {headers: this.bearerHeader()} )
     .take(1)
     .retryWhen(errors=>errors.delay(2500).take(3))
     .catch(this.errorHandler);
   }
}
