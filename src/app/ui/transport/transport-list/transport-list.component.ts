import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IListObj } from 'app/shared/ilist-obj';
import { ITitle } from 'app/shared/ititle';

import { TransportService } from '../services/transport.service';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { ITransportList } from '@bpUI/transport/interfaces/i-transport-list';
import {saveAs} from 'file-saver';
import { Jsonp } from '@angular/http';


@Component({
  selector: 'app-transport-list',
  templateUrl: './transport-list.component.html',
  styleUrls: ['./transport-list.component.css']
})
export class TransportListComponent implements OnInit, IListObj, OnDestroy {

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private actRoute: ActivatedRoute,
    private cf: CommonFunctionsService,
    private df: TransportService,
    private router: Router,
  ) { }
  
    ngOnInit() {
      this.dateRange=this.cf.dateRangeLastQuarter();
      this.isDestroyed$=new Subject<boolean>();
      this.isPending=true;
      this.initData(this.dateRange);
    }

  data: ITransportList[];
  dateRange: IDateRange;
  dataSource: any;
  displayedColumns = ['transportOfferId', 'statusCode', 'documentNo', 'fracht', 'seller', 'driver', 'loadDate', 'loadPlace', 'loadPostalCode','unloadDate', 'unloadPlace', 'unloadPostalCode' ];
  isDestroyed$: Subject<boolean>;
  isPending: boolean;

  
  createNew(): void {
    this.router.navigate(['transport', 0])
  }
  edit(id: number): void {
    this.router.navigate(['transport', id])
  }
  initData(dateRange:IDateRange): void {
    this.df.getAll(dateRange)
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      this.data = s;
      this.dataSource=new MatTableDataSource(s);
      this.cf.toastMake(`Pobrano dane, razem: ${s.length}`, "initData", this.actRoute);
      this.isPending=false;
      this.dataSource.sort=this.sort;

      this.paginator.pageSize=this.cf.paginatorPageSize(s.length);
      this.paginator.pageSizeOptions=this.cf.paginatorLimitOption(s.length);
      this.dataSource.paginator=this.paginator;
    });
  }

  searchFilter(filterValue:string)
  {
    filterValue=filterValue.trim();
    filterValue=filterValue.toLowerCase();
    this.dataSource.filter=filterValue;
  }

  navTitle: ITitle=<ITitle>{
    subtitle: "Data transakcji ",
    title: "Zlecenia transportowe"
  };

  getDataByRange(dateRange:IDateRange)
  {
    this.initData(dateRange);
  }


  genCsv(){
    let b= new Blob([this.cf.csvConverter(this.data)], {type: 'text/csv;charset=utf-8;'});
    saveAs(b, `Lista transportów ${this.dateRange.dateStart.format(this.cf.dateLocaleFormat())} - ${this.dateRange.dateEnd.format(this.cf.dateLocaleFormat())}.csv`);
  }
}
