import { IErrorObj } from '../../shared/interfaces/ierror-object';
import { Router, ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs/operator/timeout';
import { CommonFunctionsService } from '../../services/common-functions.service';
import { HttpResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs/Rx';
import { ILoginData } from './login.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TokenService } from "app/services/token.service";
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { environment } from "environments/environment";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
   constructor(public dialogRef: MatDialogRef<LoginComponent>, 
              private fb: FormBuilder,
              private http: HttpClient,
              private tokenService: TokenService,
              private cf:CommonFunctionsService,
              private actRoute: ActivatedRoute,
              private router: Router
             ) { }

  ngOnInit() {
    this.initForm();
  }

  loginFormGroup:FormGroup;
  registerFormGroup: FormGroup;

  loginUserNameIsValid: boolean;
  registerUserNameIsValid:boolean

  isPending: boolean;
  errorObj:IErrorObj[];

  
  password(){ return this.registerFormGroup.get("password");}
  confirmPassword() {return this.registerFormGroup.get("confirmPassword");}


  close(){
    this.dialogRef.close(true);
  }
  cancel(){
    this.dialogRef.close(false);
  }

  initForm(){
    this.registerFormGroup=this.fb.group({
        "userName": [null, Validators.compose([Validators.required, Validators.email])],
        "password": [null, Validators.required],
        "confirmPassword": [null, Validators.required],
    });
    this.loginFormGroup=this.fb.group({
      "userName": [null , Validators.compose([Validators.required, Validators.email])],
      "password": [null, Validators.required]
    })
  }

  

  login(){
    if(!this.loginFormGroup.valid) return;
    this.isPending=true;
    this.disableForms();
    return this.http.post(environment.apiUrlToken, JSON.stringify(this.loginFormGroup.value), {headers: new HttpHeaders({"Content-Type": "application/json"}) })
    .catch(e=>{
      this.errorObj=this.cf.httpResponseErrorHandler(e);
      this.enableForms();
      this.isPending=false;
      return Observable.throw(e);
    })
    .take(1)
    .do(d=>{this.errorObj=[]})
    .subscribe(s=>{
      this.tokenService.setToken(s);
      this.cf.toastMake(`Użytkownik ${this.tokenService.getToken().userName} został zalogowany.`, "Login", this.actRoute);
      this.isPending=false;
      return this.dialogRef.close(true);
    })
  }


  register(){
    if(!this.registerFormGroup.valid) return;
    this.isPending=true;
    this.disableForms();
    return this.http.post(environment.apiRegisterUser, JSON.stringify(this.registerFormGroup.value) ,{headers: new HttpHeaders().append("Content-type", "application/json").append("Cache-Control", "no-cache")})
      .catch((e)=> {
        this.enableForms();
        this.errorObj=this.cf.httpResponseErrorHandler(e);
        this.isPending=false;
        return Observable.throw(e);
      })
      .take(1)
      .do(d=>{this.errorObj=[]})
      .subscribe(s=>{
        this.cf.toastMake("Użytkownik został zarejestrowany ! Należy sprawdzić email by aktywować konto", "Register", this.actRoute);
        //this.errorObj.errorDescription="Użytkownik został zarejestrowany ! Należy sprawdzić email by aktywować konto";
        setTimeout(s=>{
          this.isPending=false;
          this.close();
          this.router.navigateByUrl("home");
        }, 5000);

      })
  }

  private enableForms(){
    this.loginFormGroup.enable();
    this.registerFormGroup.enable();
  }
  private disableForms(){
    this.errorObj=<IErrorObj[]>[];
    this.loginFormGroup.disable();
    this.registerFormGroup.disable(); 
  }
}



export interface ILoginData{
  userName: string,
  password:string,
  confirmPassword: string
}

