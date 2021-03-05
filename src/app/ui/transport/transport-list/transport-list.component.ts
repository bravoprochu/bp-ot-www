import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";

import { TransportService } from "../services/transport.service";
import { CommonFunctionsService } from "app/services/common-functions.service";
import { MatSort, MatTableDataSource, MatPaginator } from "@angular/material";
import { IDateRange } from "app/shared/interfaces/i-date-range";

import { Subject } from "rxjs";
import { ITransportList } from "@bpUI/transport/interfaces/i-transport-list";
import { saveAs } from "file-saver";

import { finalize, take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-transport-list",
  templateUrl: "./transport-list.component.html",
  styleUrls: ["./transport-list.component.css"],
})
export class TransportListComponent implements OnInit, IListObj, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: ITransportList[];
  dateRange: IDateRange;
  dataSource: any;
  displayedColumns = [
    "id",
    "statusCode",
    "documentNo",
    "fracht",
    "seller",
    "driver",
    "loadDate",
    "loadPlace",
    "loadPostalCode",
    "unloadDate",
    "unloadPlace",
    "unloadPostalCode",
  ];
  isDestroyed$: Subject<boolean>;
  isPending = true;
  navTitle: ITitle = <ITitle>{
    subtitle: "Data transakcji ",
    title: "Zlecenia transportowe",
  };

  constructor(
    private actRoute: ActivatedRoute,
    private cf: CommonFunctionsService,
    private df: TransportService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.dateRange = this.cf.dateRangeLastQuarter();
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending = true;
    this.initData(this.dateRange);
  }

  createNew(): void {
    this.router.navigate(["transport", 0]);
  }
  edit(id: number): void {
    this.router.navigate(["transport", id]);
  }
  initData(dateRange: IDateRange): void {
    this.isPending = true;
    this.df
      .getAll(dateRange)
      .pipe(
        take(1),
        takeUntil(this.isDestroyed$),
        finalize(() => {
          this.isPending = false;
        })
      )
      .subscribe((s) => {
        this.data = s;
        this.dataSource = new MatTableDataSource(s);
        this.cf.toastMake(
          `Pobrano dane, razem: ${s.length}`,
          "initData",
          this.actRoute
        );
        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.cf.paginatorPageSize(s.length);
        this.paginator.pageSizeOptions = this.cf.paginatorLimitOption(s.length);
        this.dataSource.paginator = this.paginator;
      });
  }

  searchFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getDataByRange(dateRange: IDateRange) {
    this.initData(dateRange);
  }

  genCsv(): void {
    this.dataSource
      .connect()
      .pipe(take(1), takeUntil(this.isDestroyed$))
      .subscribe(
        (_data: any) => {
          let b = new Blob(
            [this.cf.csvConverter(_data, this.displayedColumns)],
            { type: "text/csv;charset=utf-8;" }
          );
          saveAs(
            b,
            `Lista transportów ${this.dateRange.dateStart.format(
              this.cf.dateLocaleFormat()
            )} - ${this.dateRange.dateEnd.format(
              this.cf.dateLocaleFormat()
            )}.csv`
          );
        },
        (err) => console.log(" error", err),
        () => console.log(" finish..")
      );
  }
}
