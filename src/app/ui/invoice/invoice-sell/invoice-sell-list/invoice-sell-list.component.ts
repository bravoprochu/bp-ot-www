import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IDateRange } from 'app/shared/interfaces/i-date-range';
import { selector } from 'rxjs/operator/publish';

import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IListObj } from '../../../../shared/ilist-obj';
import { ITitle } from '../../../../shared/ititle';
import { InvoiceSellService } from '../services/invoice-sell.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-invoice-sell-list',
  templateUrl: './invoice-sell-list.component.html',
  styleUrls: ['./invoice-sell-list.component.css']
})
export class InvoiceSellListComponent implements OnInit, OnDestroy, AfterViewInit, IListObj {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private df: InvoiceSellService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private cf: CommonFunctionsService
  ) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.dateRange=this.cf.dateRangeLastQuarter();
    this.initData(this.dateRange);
  }

  ngAfterViewInit(): void {}
  
  dateRange:IDateRange=<IDateRange>{};
  dataSource:any;
  displayedColumns: string[];
  isDestroyed$: Subject<boolean>;
  search$:FormControl;

  public navTitle: ITitle = <ITitle>{
    title: 'Faktury sprzedaży',
    subtitle: `Data sprzedaży `
  };
  public isPending: boolean;

  public createNew(): void {
      this.router.navigate(['/fakturaSprzedazy',0])
  }

  public initData(dateRange?:IDateRange): void {
      this.isPending=true;
      this.displayedColumns=['id','type','documentNo', 'dataSprzedazy', 'nabywca', 'waluta', 'netto', 'podatek', 'brutto'];
      this.df.getAll(dateRange)
      .takeUntil(this.isDestroyed$)
      .subscribe(s=>{
        this.dataSource=new MatTableDataSource(s);
        this.cf.toastMake(`Pobrano dane dla zakresu od ${dateRange.dateStart.format(this.cf.dateLocaleFormat())} do ${dateRange.dateEnd.format(this.cf.dateLocaleFormat())}, razem: ${s.length}`, "initData", this.actRoute);
        this.isPending=false;
        
        this.dataSource.sort=this.sort;
        this.paginator.pageSize=this.cf.paginatorPageSize(s.length);
        this.paginator.pageSizeOptions=this.cf.paginatorLimitOption(s.length);
        this.dataSource.paginator=this.paginator;
      })
  }

  searchFilter(filterValue:string){
    filterValue=filterValue.trim();
    filterValue=filterValue.toLowerCase();
    this.dataSource.filter=filterValue;
  }


  edit(id:number)
  {
    this.router.navigate(['/fakturaSprzedazy', id]);
  }


  getDataByRange(range:any)
  {
    this.initData(range);
  }
}
