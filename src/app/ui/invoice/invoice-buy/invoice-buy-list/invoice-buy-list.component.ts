import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ITitle } from 'app/shared/ititle';

import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IListObj } from '../../../../shared/ilist-obj';
import { InvoiceBuyService } from '../services/invoice-buy.service';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subject } from 'rxjs';
import { Moment } from 'moment';
import { DEFAULT_APP_VALUES } from 'environments/environment.prod';



@Component({
  selector: 'app-invoice-sell-buy-list',
  templateUrl: './invoice-buy-list.component.html',
  styleUrls: ['./invoice-buy-list.component.css']
})
export class InvoiceBuyListComponent implements OnInit,OnDestroy, IListObj {
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private cf: CommonFunctionsService,
    private df: InvoiceBuyService,
    private fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute

  ) { }

  ngOnInit() {
    this.dateRange=this.cf.dateRangeLastQuarter();
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending=true;
    this.initData(this.dateRange);
    this.displayedColumns=['id','documentNo', 'dataSprzedazy', 'nabywca', 'waluta', 'netto', 'podatek', 'brutto'];
    
   
  }

  public navTitle: ITitle=<ITitle>{
    subtitle:"Data sprzedaży ",
    title:"Faktury zakupów"
  };
  dateRange:IDateRange;
  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  dataSource: any;
  displayedColumns: string[]


  public createNew(): void {
    this.router.navigate(['/fakturaZakupu',0])
  }
  public edit(id: number){
    this.router.navigate(['/fakturaZakupu', id]);
  }

    public initData(dateRange:IDateRange): void 
    {
      this.df.getAll(dateRange)
      .takeUntil(this.isDestroyed$)
      .subscribe(s=>{
        this.dataSource=new MatTableDataSource(s);
        this.cf.toastMake(`Pobrano dane dla zakresu od ${(<Moment>dateRange.dateStart).format(DEFAULT_APP_VALUES.dateLocalFormat)} do ${(<Moment>dateRange.dateEnd).format(DEFAULT_APP_VALUES.dateLocalFormat)}, razem: ${s.length}`, "initData", this.actRoute);
        this.isPending=false;
        
        this.dataSource.sort=this.sort;
        this.paginator.pageSize=this.cf.paginatorPageSize(s.length);
        this.paginator.pageSizeOptions=this.cf.paginatorLimitOption(s.length);
        this.dataSource.paginator=this.paginator;
      })   
    }



    searchFilter(filterValue)
    {
      filterValue=filterValue.trim();
      filterValue=filterValue.toLowerCase();
      this.dataSource.filter=filterValue;
    }
    getDataByRange(dateRange)
    {
      this.initData(dateRange);
    }
}

