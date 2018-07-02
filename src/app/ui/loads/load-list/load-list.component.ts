import { LoadDataTableSource } from '../services/load-data-table-source';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { concat } from 'rxjs/observable/concat';
import { Subject } from 'rxjs/Rx';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { MatSlider } from "@angular/material";
import * as moment from 'moment';
import { LoadService } from 'app/ui/loads/services/load.service';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.css']
})
export class LoadListComponent implements OnInit, OnDestroy, IListObj, AfterViewInit {

  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }
  @ViewChild('slider') slider: MatSlider

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private df: LoadService,
    private cf: CommonFunctionsService

  ) { }

  navTitle: ITitle = {
    subtitle: "Lista zapisanych",
    title: "Ładunki"
  };

  isPending: boolean = true;
  dataObj = [];
  contrahentsIds: number[] = [];
  dataObj$: any;
  isDestroyed$: Subject<boolean>;
  refreshTime: number = 0;
  displayedColumns = ['loadId', 'loadNo', 'companyBuyer', 'buyingDate', 'buyingPrice', 'companySeller', 'sellingDate', 'sellingPrice'];


  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.dataSource = new LoadDataTableSource(this.df);
    this.initData();
  }

  dataSource: LoadDataTableSource;




  ngAfterViewInit(): void {

    //   this.dataObj$=this.slider.change.switchMap(refreshValue=>{
    //     if(refreshValue.value==0) {
    //       return Observable.empty();
    //     } else {
    //     return Observable.interval(refreshValue.value*1000)
    //       .switchMap(sw=>this.df.getLoads() 
    //       )
    //     }
    //   }
    // )
    // .map(m=>m['_embedded']['loads'])
    // .do((loads:any[])=>{
    //   loads.forEach(load=>{
    //     let add=load.loading_place.address;
    //     if(!this.isLoadCustomer(load._links.company.id)){
    //       this.contrahentsIds.unshift(load._links.company.id);
    //     }
    //     if((add.locality=="Poznań" || add.loality=="Warszawa") && !this.isLoadId(load.id)){
    //         load["timeAgo"]=function(load_creation_date){
    //           return moment(load_creation_date).fromNow();
    //         }
    //         this.dataObj.unshift(load);

    //     }

    //   });

    // })
  }


  createNew() {
    this.router.navigate(['/ladunek', 0]);
  }

  edit(id: number): void {
    this.router.navigate(['/ladunek', id]);
  }



  initData() {
    this.dataSource
      .connect()
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.cf.toastMake(`Pobrano dane, razem: ${s.length}`, "initData", this.actRoute);
        this.isPending = false;
      });
  }

  isLoadId(id: number): boolean {
    let res = false;
    this.dataObj.forEach(l => {
      if (l.id == id) res = true;
    });
    return res;
  }

  isLoadCustomer(id: number): boolean {
    return this.contrahentsIds.indexOf(id) > -1 ? true : false;
  }

}
