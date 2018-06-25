import { LoginComponent } from '../../auth/login/login.component';
import { TokenService } from '../../services/token.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  constructor(
    private tokenService: TokenService,
    private dialog:MatDialog,
  ) { }
  ngOnInit() {
  }

  get userName():string {
    return this.tokenService.isLoggedIn ? this.tokenService.getToken().userName.split('@')[0] : null;
  }

  moreInfo(){
    console.log(this.tokenService.getToken());
  }

  logout(){
    this.tokenService.logout();
  }

  login(){
    return this.dialog.open(LoginComponent).afterClosed();
  }

}
