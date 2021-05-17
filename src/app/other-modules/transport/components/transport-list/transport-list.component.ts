import { Router } from "@angular/router";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { Subject } from "rxjs";
import { ITransportList } from "app/other-modules/transport/interfaces/i-transport-list";
import { saveAs } from "file-saver";
import { finalize, take, takeUntil } from "rxjs/operators";
import { TransportService } from "../../services/transport.service";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { DataExportsService } from "app/other-modules/data-exports/services/data-exports.service";

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
    private dataExportService: DataExportsService,
    private dateTimeService: DateTimeCommonServiceService,
    private transportService: TransportService,
    private router: Router,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.dateRange = this.dateTimeService.getRangeLastQuarter();
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending = true;
    this.initData(this.dateRange);
  }

  createNew(): void {
    this.router.navigate(["transport/transport", 0]);
  }
  edit(id: number): void {
    this.router.navigate(["transport/transport", id]);
  }
  initData(dateRange: IDateRange): void {
    this.isPending = true;
    this.transportService
      .getAllRanged(dateRange)
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
        this.toastService.toastMake(
          `Pobrano dane, razem: ${s.length}`,
          "initData"
        );
        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.transportService.paginatorPageSize(
          s.length
        );
        this.paginator.pageSizeOptions =
          this.transportService.paginatorLimitOption(s.length);
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
            [this.dataExportService.csvConverter(_data, this.displayedColumns)],
            { type: "text/csv;charset=utf-8;" }
          );
          saveAs(
            b,
            `Lista transportów ${this.dateTimeService.formatYYYYMMDD(
              this.dateRange.dateStart
            )} - ${this.dateTimeService.formatYYYYMMDD(
              this.dateRange.dateEnd
            )}.csv`
          );
        },
        (err) => console.log(" error", err),
        () => console.log(" finish..")
      );
  }
}
