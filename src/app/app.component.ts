import { TokenService } from "./services/token.service";
import { ITitle } from "./shared/ititle";
import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "../environments/environment";
import { RouteListComponent } from "./other-modules/routes-list/components/route-list/route-list.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(private dialog: MatDialog, private tokenService: TokenService) {}
  navTitle: ITitle = {
    title: environment.appName,
  };

  get isLoggedIn() {
    return this.tokenService.isLoggedIn;
  }

  ngOnInit(): void {}

  menuShow() {
    this.dialog
      .open(RouteListComponent, { height: "80%", width: "80%" })
      .afterClosed();
  }
}
