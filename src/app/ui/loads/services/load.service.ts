import { ILoadBuy } from '../../../shared/interfaces/iload';
import * as http from 'http';
import { TokenService } from '../../../services/token.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataFactoryService } from "app/services/data-factory.service";
import { ILoad } from 'app/shared/interfaces/iload';


@Injectable()
export class LoadService extends DataFactoryService {

  constructor(http: HttpClient, tokenService: TokenService) { 
    super(environment.apiUrlLoad, http, tokenService);
    
  }


  getLoads():Observable<any>{
    return this.http.get(environment.apiTransEuLoads, 
      {headers: this.bearerHeader()}
    )
    .take(1)
//    .retryWhen(errors=>errors.delay(2500).take(3))
    .catch(this.errorHandler);
  }



  genPdf(load:ILoad):Observable<any>{
    return this.http.post(environment.apiUrlLoadGenPdf,load, 
    {headers: this.bearerHeader(), responseType: 'blob'}
    )
    .take(1)
    .catch(this.errorHandler);
  }

  loadInvoiceSellGen(id:number):Observable<any>
  {
    return this.http.get(environment.apiUrlLoadInvoiceSellGet+id, 
      {
      headers: this.bearerHeader()
    })
    .take(1)
    .catch(this.errorHandler);
  }


  updateBuy(id:number, load:ILoad):Observable<any>
  {
    return this.http.put(environment.apiUrlLoadUpdatBuy+id, JSON.stringify(load), 
      {headers: this.bearerHeader()}
    )
    .take(1)
    .catch(this.errorHandler);
  }

  updateTransEu(id: number, load:ILoad):Observable<any>
  {
    return this.http.put(environment.apiUrlLoadUpdateTransEu+id, JSON.stringify(load), 
      {headers: this.bearerHeader()}
    )
    .take(1)
    .catch(this.errorHandler);
  }

  updateSell(id: number, load:ILoad):Observable<any>
  {
    return this.http.put(environment.apiUrlLoadUpdateSell+id, JSON.stringify(load), 
      {headers: this.bearerHeader()}
    )
    .take(1)
    .catch(this.errorHandler);
  }


}
