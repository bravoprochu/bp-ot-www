import { DataFactoryService } from "../data-factory.service";
import { TokenService } from "../token.service";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class TranseuService extends DataFactoryService {
  constructor(http: HttpClient, tokenService: TokenService) {
    super(environment.apiUrlLoad, http, tokenService);
  }

  kontrahentById(kontrahentId: string) {
    let headers = this.bearerHeader();
    return this.http.get(
      environment.apiTransEuKontrahentById + "/" + kontrahentId,
      { headers: headers }
    );
  }
}

export interface ITransEuAppCreds {
  clientId: string;
  client_secret: string;
}
