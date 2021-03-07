import { LoginComponent } from "../../auth/login/login.component";
import { TokenService } from "../../services/token.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { MatDialog } from "@angular/material";
import { switchMap } from "rxjs/operators";

@Injectable()
export class IdentGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let res = false;
    if (this.tokenService.isAuthorized(next.data)) {
      return of(true);
    } else {
      return this.dialog
        .open(LoginComponent)
        .afterClosed()
        .pipe(
          switchMap((isLoggedIn: boolean) => {
            return isLoggedIn === true &&
              this.tokenService.isAuthorized(next.data)
              ? of(true)
              : of(false);
          })
        );
    }
  }
}
