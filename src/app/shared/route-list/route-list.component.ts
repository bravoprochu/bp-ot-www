import { TokenService } from '../../services/token.service';
import { uiRoutes } from '../../ui/ui-routing.module';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogRef, MatSelect, MatList } from "@angular/material";
import { Subject } from "rxjs/Subject";

import {filter, map,mergeAll} from "rxjs/operators"

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';


@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.css']
})
export class RouteListComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
  }
  @Input() sideNav:any;

  constructor(router: Router, 
              route: ActivatedRoute,
               private tokenService: TokenService,
              public dialogRef: MatDialogRef<RouteListComponent>
                ) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.routesListPrep();
    this.routes= this.sortRoutes(this.routesData);
  }


  isDestroyed$: Subject<boolean>;
  routes:INavRoutes[];
  routesData:INavRoutes[];
  searchText:string;
  
  sideNavShut(){
    this.dialogRef.close();
  }

  searchTextChange(txt:string){
    if(txt==null || txt==undefined || txt=="") {this.routes=this.routesData; return};
    let t=txt.toLowerCase();
    this.routes = (this.routesData.filter(f=>{
      return (
         (f.name).toLowerCase().includes(t) 
      || (f.description!==undefined? f.description.toLowerCase().includes(t):null)
    )
    })
    .sort((a,b)=>{
      return a.name.localeCompare(b.name)? 1:-1
    })
  )
 }

  sortRoutes(routes: INavRoutes[]){
    return routes.sort(function(a,b){
      return (a.name.localeCompare(b.name,'pl', {localeMatcher: 'best fit', sensitivity: 'base'}));
    })
  }

  routesListPrep(){
    let userRoles= this.tokenService.getToken().rolesList;
    this.routesData=[];
    uiRoutes.forEach((route:Route)=>{
      if(route.data["name"]){
      let routeListPosition:INavRoutes={
        description:route.data["description"],
        group: route.data["group"],
        name: route.data["name"],
        route:route.path
      };
      if(this.tokenService.isRouteAuthorized(route.data)){
        this.routesData.push(routeListPosition);}
    }
    });
  }
}

export interface INavRoutes
{
  route: string,
  name: string,
  group: string,
  description: string
}


