import { TokenService } from './token.service';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { catchError, take } from 'rxjs/operators';



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
    .pipe(
      take(1),
      catchError(this.errorHandler)
    )

    } else {
    return this.http.get(this.url+"/GetAll", 
      {headers: this.bearerHeader()}
    )
    //.retryWhen(errors=>errors.delay(2500).take(3))
    .pipe(
      take(1),
      catchError(this.errorHandler)
    )
  }
  }

  getById(id:number):Observable<any>{
      return this.http.get(this.url+"/GetById/"+id, 
      {headers: this.bearerHeader()}
    )
    .pipe(
      take(1),
      catchError(this.errorHandler)
    )
  }

  create(item:any):Observable<any>{
    console.log(item);
    return this.http.post(this.url+"/Post", item,
      {headers: this.bearerHeader()}
    )
    .pipe(
      take(1),
      catchError(this.errorHandler)
    )
  }

  delete(id: number):Observable<any>{
    return this.http.delete(this.url+"/Delete/"+id, 
      {headers: this.bearerHeader()}
  )
  .pipe(
    take(1),
    catchError(this.errorHandler)
  )
  }

  update(id: number, item: any):Observable<any>{
    return this.http.put(this.url+"/Put/"+id, JSON.stringify(item), 
    {headers: this.bearerHeader()}
  )
  .pipe(
    take(1),
    catchError(this.errorHandler)
  )
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
