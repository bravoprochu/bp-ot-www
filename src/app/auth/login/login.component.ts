import { IErrorObj } from "../interfaces/ierror-object";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TokenService } from "app/services/token.service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "environments/environment";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { catchError, take, tap } from "rxjs/operators";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;

  loginUserNameIsValid: boolean;
  registerUserNameIsValid: boolean;

  isPending: boolean;
  errorObj: IErrorObj[];

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastMakeService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  password() {
    return this.registerFormGroup.get("password");
  }
  confirmPassword() {
    return this.registerFormGroup.get("confirmPassword");
  }

  close() {
    this.dialogRef.close(true);
  }
  cancel() {
    this.dialogRef.close(false);
  }

  initForm() {
    this.registerFormGroup = this.fb.group({
      userName: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
    this.loginFormGroup = this.fb.group({
      userName: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: [null, Validators.required],
    });
  }

  login() {
    if (!this.loginFormGroup.valid) return;
    this.isPending = true;
    this.disableForms();
    return this.http
      .post(
        environment.apiUrlToken,
        JSON.stringify(this.loginFormGroup.value),
        { headers: new HttpHeaders({ "Content-Type": "application/json" }) }
      )
      .pipe(
        catchError((e) => {
          this.errorObj = this.httpResponseErrorHandler(e);
          this.enableForms();
          this.isPending = false;
          return Observable.throw(e);
        }),
        take(1),
        tap(() => {
          this.errorObj = [];
        })
      )
      .subscribe((s) => {
        this.tokenService.setToken(s);
        this.toastService.toastMake(
          `Użytkownik ${
            this.tokenService.getToken().userName
          } został zalogowany.`,
          "Login"
        );
        this.isPending = false;
        return this.dialogRef.close(true);
      });
  }

  register() {
    if (!this.registerFormGroup.valid) return;
    this.isPending = true;
    this.disableForms();
    return this.http
      .post(
        environment.apiRegisterUser,
        JSON.stringify(this.registerFormGroup.value),
        {
          headers: new HttpHeaders()
            .append("Content-type", "application/json")
            .append("Cache-Control", "no-cache"),
        }
      )
      .pipe(
        catchError((e) => {
          this.enableForms();
          this.errorObj = this.httpResponseErrorHandler(e);
          this.isPending = false;
          return Observable.throw(e);
        }),
        take(1),
        tap(() => {
          this.errorObj = [];
        })
      )

      .subscribe(() => {
        this.toastService.toastMake(
          "Użytkownik został zarejestrowany ! Należy sprawdzić email by aktywować konto",
          "Register"
        );
        setTimeout(() => {
          this.isPending = false;
          this.close();
          this.router.navigateByUrl("home");
        }, 5000);
      });
  }

  private enableForms() {
    this.loginFormGroup.enable();
    this.registerFormGroup.enable();
  }
  private disableForms() {
    this.errorObj = <IErrorObj[]>[];
    this.loginFormGroup.disable();
    this.registerFormGroup.disable();
  }

  private httpResponseErrorHandler(resErrors: HttpErrorResponse): IErrorObj[] {
    let res: IErrorObj[] = [];
    let err = resErrors["error"];

    if (err["type"] != "error") {
      for (let key in err) {
        let errGroupName = err[key];
        let e = <IErrorObj>{
          errorDescription: key,
          errors: [],
        };
        errGroupName.forEach((el) => {
          e.errors.push(el);
        });
        res.push(e);
      }
    } else {
      // no errors object
      let e = <IErrorObj>{
        errorDescription: "Error",
        errors: [],
      };
      e.errors.push("Inny błąd serwera");
      res.push(e);
    }
    return res;
  }
}

export interface ILoginData {
  userName: string;
  password: string;
  confirmPassword: string;
}
