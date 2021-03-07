import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { IDateRange } from "app/shared/interfaces/i-date-range";
import { IListObj } from "../../../../shared/ilist-obj";
import { ITitle } from "../../../../shared/ititle";
import { InvoiceSellService } from "../services/invoice-sell.service";
import { Subject } from "rxjs";
import { Moment } from "moment";
import { DEFAULT_APP_VALUES } from "environments/environment";
import { saveAs } from "file-saver";
import { take, takeUntil } from "rxjs/operators";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";

@Component({
  selector: "app-invoice-sell-list",
  templateUrl: "./invoice-sell-list.component.html",
  styleUrls: ["./invoice-sell-list.component.css"],
})
export class InvoiceSellListComponent implements OnInit, OnDestroy, IListObj {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateRange: IDateRange = <IDateRange>{};
  dataSource: any;
  displayedColumns: string[];
  isDestroyed$: Subject<boolean>;
  isGroupClone: boolean;
  search$: FormControl;

  constructor(
    private invoiceCommonService: InvoiceCommonFunctionsService,
    private invoiceSellService: InvoiceSellService,
    private router: Router,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.dateRange = this.invoiceCommonService.dateRangeLastQuarter();
    this.initData(this.dateRange);
  }

  public navTitle: ITitle = <ITitle>{
    title: "Faktury sprzedaży",
    subtitle: `Data sprzedaży `,
  };
  public isPending: boolean;

  public createNew(): void {
    this.router.navigate(["/invoices/fakturaSprzedazy", 0]);
  }

  public initData(dateRange?: IDateRange): void {
    this.isPending = true;

    this.displayedColumns = [
      "id",
      "type",
      "documentNo",
      "dataSprzedazy",
      "nabywca",
      "waluta",
      "netto",
      "podatek",
      "brutto",
    ];
    this.invoiceSellService
      .getAll(dateRange)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s: any) => {
        this.dataSource = new MatTableDataSource(s);
        this.toastService.toastMake(
          `Pobrano dane dla zakresu od ${(<Moment>dateRange.dateStart).format(
            DEFAULT_APP_VALUES.dateLocalFormat
          )} do ${(<Moment>dateRange.dateEnd).format(
            DEFAULT_APP_VALUES.dateLocalFormat
          )}, razem: ${s.length}`,
          "initData"
        );
        this.isPending = false;

        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.invoiceCommonService.paginatorPageSize(
          s.length
        );
        this.paginator.pageSizeOptions = this.invoiceCommonService.paginatorLimitOption(
          s.length
        );
        this.dataSource.paginator = this.paginator;
      });
  }

  searchFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  edit(id: number) {
    this.router.navigate(["/invoices/fakturaSprzedazy", id]);
  }

  getDataByRange(range: any) {
    this.initData(range);
  }

  genCsv() {
    this.dataSource
      .connect()
      .pipe(take(1))
      .subscribe((_data: any) => {
        let b = new Blob(
          [
            this.invoiceCommonService.csvConverter(
              _data,
              this.displayedColumns
            ),
          ],
          {
            type: "text/csv;charset=utf-8;",
          }
        );
        saveAs(
          b,
          `Lista faktur sprzedaży ${this.dateRange.dateStart.format(
            this.invoiceCommonService.dateLocaleFormat()
          )} - ${this.dateRange.dateEnd.format(
            this.invoiceCommonService.dateLocaleFormat()
          )}.csv`
        );
      });
  }
}
