import { DialogDataTypes } from "../../../../shared/enums/dialog-data-types.enum";
import { IDialogData } from "../../../../shared/interfaces/i-dialog-data";
import { CommonFunctionsService } from "../../../../services/common-functions.service";
import { CompanyComponent } from "../company/company.component";
import { Component, OnDestroy, OnInit } from "@angular/core";
import "rxjs/add/operator/take";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/switchMap";
import { ActivatedRoute } from "@angular/router";
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";
import {
  MatDialog,
  MatTableDataSource,
  MatSort,
  MatPaginator,
} from "@angular/material";
import { ContractorService } from "../../services/contractor.service";
import { ViewChild } from "@angular/core";
import { take } from "rxjs/operators";
import { saveAs } from "file-saver";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ICompany } from "../../interfaces/icompany";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";

@Component({
  selector: "app-company-list",
  templateUrl: "./company-list.component.html",
  styleUrls: ["./company-list.component.css"],
})
export class CompanyListComponent implements OnInit, OnDestroy, IListObj {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataObj: any[];
  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  searchFor$ = new Subject();
  searchForCtrl: any;
  dataSource: MatTableDataSource<ICompany>;
  displayedColumns = ["id", "skrot", "nip", "adres", "telefon"];
  navTitle: ITitle = {
    subtitle: "Baza zapisanych firm",
    title: "Firma",
  };

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }
  constructor(
    private actRoute: ActivatedRoute,
    private contractorService: ContractorService,
    private dialog: MatDialog,
    private toastService: ToastMakeService
  ) {}

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending = true;
    this.initData();
  }

  initData(): void {
    this.contractorService
      .getAll()
      .takeUntil(this.isDestroyed$)
      .subscribe((s) => {
        this.dataSource = new MatTableDataSource<ICompany>(s);
        this.toastService.toastMake(
          `Pobrano dane, razem: ${s.length}`,
          "initData"
        );
        this.isPending = false;

        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.contractorService.paginatorPageSize(
          s.length
        );
        this.paginator.pageSizeOptions = this.contractorService.paginatorLimitOption(
          s.length
        );
        this.dataSource.paginator = this.paginator;
      });
  }

  createNew() {
    return this.dialog
      .open(CompanyComponent, { height: "80%", width: "80%" })
      .afterClosed();
  }

  genCsv() {
    this.dataSource
      .connect()
      .pipe(take(1))
      .subscribe((_data: any) => {
        let b = new Blob(
          [this.contractorService.csvConverter(_data, this.displayedColumns)],
          {
            type: "text/csv;charset=utf-8;",
          }
        );
        saveAs(b, `Lista kontrahentów.csv`);
      });
  }

  drop(ev: CdkDragDrop<string[]>): void {
    if (ev.currentIndex == ev.previousIndex) {
      return;
    }
    moveItemInArray(this.displayedColumns, ev.previousIndex, ev.currentIndex);
  }

  edit(idx: number) {
    this.contractorService
      .getById(idx)
      .toPromise()
      .then((company) => {
        if (company != null) {
          let dialogData: IDialogData = {
            type: DialogDataTypes.return,
            formData: company,
            componentKeyName: "companyId",
          };
          return this.dialog
            .open(CompanyComponent, {
              data: dialogData,
              height: "80%",
              width: "80%",
            })
            .afterClosed()
            .take(1)
            .subscribe((s: ICompany) => {
              if (s != undefined) {
                this.ngOnInit();
              }
            });
        }
      });
  }

  searchFilter(filterValue) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  saveFrom() {}
}
