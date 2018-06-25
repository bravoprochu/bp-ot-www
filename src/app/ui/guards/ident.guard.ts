import { observable } from 'rxjs/symbol/observable';
import { LoginComponent } from '../../auth/login/login.component';
import { TokenService } from '../../services/token.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { MatDialog } from "@angular/material";


@Injectable()
export class IdentGuard implements CanActivate {
constructor(
  private tokenService: TokenService,
  private router: Router,
  private dialog: MatDialog
 ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):Observable<boolean>|boolean {
      let res=false;
      if(this.tokenService.isAuthorized(next.data)){
        return true
      } else {
        this.dialog.open(LoginComponent)
          .afterClosed()
          .take(1)
          .subscribe(s=>res=s);
      }

      return res;
  }
}
