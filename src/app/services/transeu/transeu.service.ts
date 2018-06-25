
import { HttpResponse } from '@angular/common/http/src/response';
import { Headers } from '@angular/http';
import { DataFactoryService } from '../data-factory.service';
import { observable } from 'rxjs/symbol/observable';
import { Observable } from 'rxjs/Rx';
import { TransEuPasswordComponent } from '../../ui/trans-eu-password/trans-eu-password.component';
import { TokenService } from '../token.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material";

@Injectable()
export class TranseuService extends DataFactoryService {

  constructor(
    http: HttpClient,
    tokenService: TokenService, 

    private mddialog: MatDialog,
  ) { 
    super(environment.apiUrlLoad, http, tokenService);
  }

  kontrahentById(kontrahentId:string)
  {
      let headers=this.bearerHeader();
      return this.http.get(environment.apiTransEuKontrahentById+"/"+kontrahentId, {headers: headers});
  }
}

export interface ITransEuAppCreds
{
  clientId: string,
  client_secret: string
}