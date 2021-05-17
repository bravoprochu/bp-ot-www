import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ITitle } from "app/shared/ititle";
import { IListObj } from "../../../../shared/ilist-obj";
import { InvoiceBuyService } from "../services/invoice-buy.service";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { saveAs } from "file-saver";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { DataExportsService } from "app/other-modules/data-exports/services/data-exports.service";

@Component({
  selector: "app-invoice-sell-buy-list",
  templateUrl: "./invoice-buy-list.component.html",
  styleUrls: ["./invoice-buy-list.component.css"],
})
export class InvoiceBuyListComponent implements OnInit, OnDestroy, IListObj {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  navTitle: ITitle = <ITitle>{
    subtitle: "Data sprzedaży ",
    title: "Faktury zakupów",
  };
  dateRange: IDateRange;
  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  dataSource: any;
  displayedColumns: string[];

  constructor(
    private dataExportService: DataExportsService,
    private dateTimeService: DateTimeCommonServiceService,
    private invoiceCommonService: InvoiceCommonFunctionsService,
    private df: InvoiceBuyService,
    private router: Router,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.dateRange = this.dateTimeService.getRangeLastQuarter();
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending = true;
    this.initData(this.dateRange);
    this.displayedColumns = [
      "id",
      "documentNo",
      "dataSprzedazy",
      "nabywca",
      "waluta",
      "netto",
      "podatek",
      "brutto",
    ];
  }

  createNew(): void {
    this.router.navigate(["/invoices/fakturaZakupu", 0]);
  }
  edit(id: number) {
    this.router.navigate(["/invoices/fakturaZakupu", id]);
  }

  initData(dateRange: IDateRange): void {
    this.df
      .getAllRanged(dateRange)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.dataSource = new MatTableDataSource(s);
        this.toastService.toastMake(
          `Pobrano dane dla zakresu od ${this.dateTimeService.formatYYYYMMDD(
            this.dateRange.dateStart
          )} do ${this.dateTimeService.formatYYYYMMDD(
            this.dateRange.dateEnd
          )}, razem: ${s.length}`,
          "initData"
        );
        this.isPending = false;

        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.invoiceCommonService.paginatorPageSize(
          s.length
        );
        this.paginator.pageSizeOptions =
          this.invoiceCommonService.paginatorLimitOption(s.length);
        this.dataSource.paginator = this.paginator;
      });
  }

  genCsv() {
    this.dataSource
      .connect()
      .pipe(take(1))
      .subscribe((_data: any) => {
        let b = new Blob(
          [this.dataExportService.csvConverter(_data, this.displayedColumns)],
          {
            type: "text/csv;charset=utf-8;",
          }
        );
        saveAs(
          b,
          `Lista faktur zakupowych ${this.dateTimeService.formatYYYYMMDD(
            this.dateRange.dateStart
          )} - ${this.dateTimeService.formatYYYYMMDD(
            this.dateRange.dateEnd
          )}.csv`
        );
      });
  }

  searchFilter(filterValue) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  getDataByRange(dateRange) {
    this.initData(dateRange);
  }
}
