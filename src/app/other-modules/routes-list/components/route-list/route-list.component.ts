import { TokenService } from "../../../../services/token.service";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";
import { INavRoute } from "../../interfaces/i-nav-route";
import { ROUTES_LIST_DATA } from "../../data/routes-list-data";

@Component({
  selector: "app-route-list",
  templateUrl: "./route-list.component.html",
  styleUrls: ["./route-list.component.css"],
})
export class RouteListComponent implements OnInit, OnDestroy {
  @Input() sideNav: any;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  routes = [] as INavRoute[];
  routesData = [] as INavRoute[];
  searchText = "" as string;

  constructor(
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<RouteListComponent>
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.routesListPrep();
    this.routes = this.sortRoutes(this.routesData);
  }

  sideNavShut(): void {
    this.dialogRef.close();
  }

  searchTextChange(txt: string): void {
    if (txt == null || txt == undefined || txt == "") {
      this.routes = this.routesData;
      return;
    }
    let t = txt.toLowerCase();
    this.routes = this.routesData
      .filter((f) => {
        return (
          f.name.toLowerCase().includes(t) ||
          (f.description !== undefined
            ? f.description.toLowerCase().includes(t)
            : null)
        );
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name) ? 1 : -1;
      });
  }

  sortRoutes(routes: INavRoute[]) {
    return routes.sort(function (a, b) {
      return a.name.localeCompare(b.name, "pl", {
        localeMatcher: "best fit",
        sensitivity: "base",
      });
    });
  }

  routesListPrep() {
    let userRoles = this.tokenService.getToken().rolesList;
    this.routesData = [];

    this.routesData = ROUTES_LIST_DATA;

    // uiRoutes.forEach((route: Route) => {
    //   if (route.data["name"]) {
    //     let routeListPosition: INavRoute = {
    //       description: route.data["description"],
    //       group: route.data["group"],
    //       name: route.data["name"],
    //       route: route.path,
    //     };
    //     if (this.tokenService.isRouteAuthorized(route.data)) {
    //       this.routesData.push(routeListPosition);
    //     }
    //   }
    // });
  }
}
