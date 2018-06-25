import { ICompany } from '../../../shared/interfaces/icompany';
import { DialogDataTypes } from '../../../shared/enums/dialog-data-types.enum';
import { IDialogData } from '../../../shared/interfaces/i-dialog-data';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { CompanyComponent } from '../company/company.component';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
import { Observable } from "rxjs/Observable";
import { IPhotos } from "app/services/data/iphotos";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { Router, ActivatedRoute } from "@angular/router";
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";
import { MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { CompanyService } from 'app/ui/company/services/company.service';
import { ViewChild } from '@angular/core';



@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnDestroy, IListObj
{
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
  }
  constructor(
    private actRoute: ActivatedRoute,
    private cf: CommonFunctionsService,
    private df: CompanyService,
    private fB: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.isPending=true;
    this.initData();    
  };

  dataObj:any[];
  isDestroyed$: Subject<boolean>;
  isPending:boolean;
  searchFor$=new Subject();
  searchForCtrl:any;
  dataSource: any;
  tableHeaders: string[]=['companyId', 'vat_id', 'short_name', 'addressList[0]addresCombined', 'telephone']

  navTitle: ITitle={
    subtitle:'Baza zapisanych firm',
    title: 'Firma'
  };

  initData(): void {
    this.df.getAll()
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      this.dataSource=new MatTableDataSource(s);
      this.cf.toastMake(`Pobrano dane, razem: ${s.length}`, "initData", this.actRoute);
      this.isPending=false;
     
      this.dataSource.sort=this.sort;
      this.paginator.pageSize=this.cf.paginatorPageSize(s.length);
      this.paginator.pageSizeOptions=this.cf.paginatorLimitOption(s.length);
      this.dataSource.paginator=this.paginator;
    });
  }

  createNew(){
    return this.dialog.open(CompanyComponent, {height: "80%", width: "80%"})
      .afterClosed();
  }

  edit(idx: number){
    this.df.getById(idx)
      .toPromise()
      .then(company=> {
        if(company!=null){
          let dialogData:IDialogData={
            type: DialogDataTypes.return,
            formData: company,
            componentKeyName: 'companyId'
          }
          return this.dialog.open(CompanyComponent, {data: dialogData, height: "80%", width: "80%"})
          .afterClosed()
          .take(1)
          .subscribe((s:ICompany)=>{
            if(s!=undefined){
            this.ngOnInit();
            }
          });
        }
      })
      
  }



  searchFilter(filterValue)
  {
    filterValue=filterValue.trim();
    filterValue=filterValue.toLowerCase();
    this.dataSource.filter=filterValue;
  }
  
  saveFrom(){
  }

}
