import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { observable } from 'rxjs/symbol/observable';
import { ObjectUnsubscribedError, Observable, Subject } from 'rxjs/Rx';
import { LoginComponent } from '../auth/login/login.component';
import { JwtHelper } from 'angular2-jwt';
import { split } from 'ts-node/dist';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {environment} from "../../environments/environment";
import { MatDialog } from '@angular/material';



@Injectable()
export class TokenService {

  private _tokenName:string= environment.appName+"_token";
  private jwtHelper:JwtHelper=new JwtHelper();
  private dialog:MatDialog;
  constructor(
  ) { }


  get isLoggedIn(): boolean{
    if(this.getFromLocalStorage()==null) return false;
    return !this.jwtHelper.isTokenExpired(this.getFromLocalStorage().token);
  }


  private clearLocalStorage(){
      let t:IToken=this.getFromLocalStorage();
      if(t==null) return;
      localStorage.removeItem(this._tokenName);
  }
  
  private deleteToken(){
    if(localStorage.getItem(this._tokenName)!=null) localStorage.removeItem(this._tokenName);
  }

  private getFromLocalStorage():IToken {
    let t =localStorage.getItem(this._tokenName);
    return t==null ? null: JSON.parse(t);
  }

  getToken(){
    return this.getFromLocalStorage();
  }
  
  isAuthorized(routeData:any):boolean{
    return this.isLoggedIn && this.isRouteAuthorized(routeData);
  }

  isRouteAuthorized(routeData:any):boolean{
//    return true;
    let res:boolean;
    let roles:string[]=this.getToken().rolesList;
    let allowed=routeData.allowed;
    if(allowed!==undefined && roles!==null){
        if(roles.indexOf(allowed)>-1) return true;
    }
    return res;
  }

  logout(){
    this.clearLocalStorage();
  }

  setToken(token:any){
    token=token["token"];
    let tObj:ITokenSource=this.jwtHelper.decodeToken(token);  
    let tokenToStorage:IToken={
      expirationTime:this.jwtHelper.getTokenExpirationDate(token).toString(),
      //rolesList: tObj.roles.split(" | "),
      rolesList: this.rolesPrep(tObj.roles),
      token:token,
      transId:tObj.transId,
      userName:tObj.sub
    };
    localStorage.setItem(this._tokenName,JSON.stringify(tokenToStorage));
  }

  rolesPrep(roles:any):string[]{
    let rolesList:string[]=[];
    if(typeof(roles)==="string"){
      rolesList.push(roles);
    } else {
      roles.forEach(role => {
        rolesList.push(role);
      });
    }
    return rolesList;
  }
}


export interface IToken{
  userName: string,
  expirationTime: string,
  token: string,
  rolesList: string[],
  transId: string
}

export interface ITokenSource{
  aud:string,
  exp:string,
  iss:string,
  jti:string,
  roles:string[],
  sub:string,
  transId:string
}