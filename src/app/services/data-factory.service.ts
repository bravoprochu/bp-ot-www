import { IInvoiceSell } from '../shared/interfaces/iinvoice-sell';
import { Headers, ResponseType } from '@angular/http';
import { TokenService } from './token.service';
import { JwtHelper } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDateRange } from 'app/shared/interfaces/i-date-range';



@Injectable()
export class DataFactoryService {

  constructor(
    private url: string,
    protected http: HttpClient,
    protected tokenService: TokenService
    ) { }
  
  
  protected bearerHeader(){
    if(this.tokenService.isLoggedIn){
      return new HttpHeaders()
      .set("Content-Type", "application/json")
      .set('Authorization', 'Bearer '+this.tokenService.getToken().token);

    //return new HttpHeaders().set('Authorization', 'Bearer '+this.tokenService.getToken().token);
    } 
  }


  getAll(dateRange?: IDateRange):Observable<any>{

    if(dateRange){
      return this.http.get(this.url+`/GetAll/${dateRange.dateStart.toISOString()}/${dateRange.dateEnd.toISOString()}`, 
      {headers: this.bearerHeader()}
    )
    .take(1)
    //.retryWhen(errors=>errors.delay(2500).take(3))
    .catch(this.errorHandler);

    } else {
    return this.http.get(this.url+"/GetAll", 
      {headers: this.bearerHeader()}
    )
    //.retryWhen(errors=>errors.delay(2500).take(3))
    .catch(this.errorHandler);
  }
  }

  getById(id:number):Observable<any>{
      return this.http.get(this.url+"/GetById/"+id, 
      {headers: this.bearerHeader()}
    ).take(1)
    // .retryWhen(errors=>errors.delay(2500).take(3))
    //.onErrorResumeNext()
    .catch(this.errorHandler);
  }

  create(item:any):Observable<any>{
    console.log(item);
    return this.http.post(this.url+"/Post", item,
      {headers: this.bearerHeader()}
    ).take(1)
    //.retryWhen(errors=>errors.delay(2500).take(3))
    .catch(this.errorHandler);
  }

  delete(id: number):Observable<any>{
    return this.http.delete(this.url+"/Delete/"+id, 
      {headers: this.bearerHeader()}
  ).take(1)
//    .retryWhen(errors=>errors.delay(2500).take(3))
    .onErrorResumeNext()
    //.catch(this.errorHandler);
  }

  update(id: number, item: any):Observable<any>{
    return this.http.put(this.url+"/Put/"+id, JSON.stringify(item), 
    {headers: this.bearerHeader()}
  ).take(1)
    // .retryWhen(errors=>errors.delay(2500).take(3))
    .catch(this.errorHandler);
  }




  protected errorHandler(error:Response)  {
    //this.tokenService.monitToast(err);
    return Observable.throw(error);
    // if(error.status==400){
    //   return Observable.throw("Bad input..?");
    // }
    //  if(error.status==404){
    //   return Observable.throw("Not found error !!");
    // }
    // return Observable.throw(error || 'server error');
  }

}
