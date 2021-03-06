import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFactoryService } from "app/services/data-factory.service";
import { TokenService } from 'app/services/token.service';
import { environment } from 'environments/environment';



@Injectable()
export class CompanyService extends DataFactoryService {

  constructor(http: HttpClient, tokenService:TokenService) {
    super(environment.apiUrlCompany, http, tokenService);
  }

  getByKey(key:string){
    return this.http.get(environment.apiUrlCompany+"/GetByKey/"+key,{
      headers: this.bearerHeader()
    })
    .catch(this.errorHandler);
  }

  getTransEuEmployeeList(employeeUrl: string){
    let reqBody={
      employeeUrl
    };

    return this.http.post(environment.getTransEuEmployeeList, JSON.stringify(reqBody),
    {
      headers: this.bearerHeader()
    });
  }

}
