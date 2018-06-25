import { TokenService } from './services/token.service';
import { ITitle } from './shared/ititle';
import { IBasicNav } from './services/ibasic-nav';
import { RouteListComponent } from './shared/route-list/route-list.component';
import { Component, OnInit, Input } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { MatDialog } from "@angular/material";
import { LoginComponent } from "app/auth/login/login.component";
import { environment} from "../environments/environment"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  constructor(
    private dialog: MatDialog,
    private tokenService: TokenService
  ){

}
  navTitle:ITitle={
    title: environment.appName
  }

  get isLoggedIn(){
    return this.tokenService.isLoggedIn;
  }

  ngOnInit(): void {
  }

  menuShow(){
    this.dialog.open(RouteListComponent, {height:"80%", width: "80%"}).afterClosed()
  }

}

