import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { empty, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { OnDestroy } from "@angular/core";
import { PaymentRemindDialogComponent } from "../payment-remind-dialog/payment-remind-dialog.component";
import { switchMap, take, takeUntil } from "rxjs/operators";
import { InvoicesPaymentStatusService } from "../../services/invoices-payment-status.service";

@Component({
  selector: "app-invoices-payment-status",
  templateUrl: "./invoices-payment-status.component.html",
  styleUrls: ["./invoices-payment-status.component.css"],
})
export class InvoicesPaymentStatusComponent implements OnInit, OnDestroy {
  isAlive: Boolean;
  isDestroyed$ = new Subject() as Subject<boolean>;
  isPending: boolean;

  unpaid: any[];
  unpaidFilterInfo: string;
  unpaidFiltered: any[];
  unpaidSearch$: FormControl;
  unpaidStats: any[];

  unpaidOverdue: any[];
  unpaidOverdueFilterInfo: string;
  unpaidOverdueFiltered: any[];
  unpaidOverdueSearch$: FormControl;
  unpaidOverdueStats: any[];

  notConfirmed: any[];
  notConfirmedFiltered: any[];
  notConfirmedFilterInfo: string;
  notConfirmedSearch$: FormControl;
  notConfirmedStats: any[];

  constructor(
    private invoicePaymentStatusService: InvoicesPaymentStatusService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isPending = true;
    this.unpaidSearch$ = new FormControl();
    this.unpaidOverdueSearch$ = new FormControl();
    this.notConfirmedSearch$ = new FormControl();
    this.initData();
    this.initForm();
    this.isAlive = true;
  }

  initData() {
    this.isPending = true;
    this.invoicePaymentStatusService
      .paymentRemind()
      .pipe(take(1))
      .subscribe((s) => {
        this.unpaid = s["unpaid"];
        this.unpaidFiltered = s["unpaid"];
        this.unpaidStats = s["unpaidStats"];

        this.unpaidOverdue = s["unpaidOverdue"];
        this.unpaidOverdueFiltered = s["unpaidOverdue"];
        this.unpaidOverdueStats = s["unpaidOverdueStats"];

        this.notConfirmed = s["notConfirmed"];
        this.notConfirmedFiltered = s["notConfirmed"];
        this.notConfirmedStats = s["notConfirmedStats"];

        this.isPending = false;
      });
  }

  initForm() {
    this.unpaidSearch$.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.unpaidFiltered = this.filterArr(s, this.unpaid);
        this.unpaidFilterInfo =
          s.length > 0
            ? `Zastosowano filtr, znaleziono: ${this.unpaidFiltered.length}`
            : "";
      });

    this.unpaidOverdueSearch$.valueChanges
      .pipe(takeUntil(this.isDestroyed$))

      .subscribe((s) => {
        this.unpaidOverdueFiltered = this.filterArr(s, this.unpaidOverdue);
        this.unpaidOverdueFilterInfo =
          s.length > 0
            ? `Zastosowano filtr, znaleziono: ${this.unpaidOverdueFiltered.length}`
            : "";
      });

    this.notConfirmedSearch$.valueChanges
      .pipe(takeUntil(this.isDestroyed$))

      .subscribe((s) => {
        this.notConfirmedFiltered = this.filterArr(s, this.notConfirmed);
        this.notConfirmedFilterInfo =
          s.length > 0
            ? `Zastosowano filtr, znaleziono: ${this.notConfirmedFiltered.length}`
            : "";
      });
  }

  checkAsPaid(payment: any, arr: any[]): void {
    let idx = arr.indexOf(payment);
    this.dialog
      .open(PaymentRemindDialogComponent, {
        data: {
          title: payment["company"]["shortName"],
          price: payment["invoiceTotal"]["total_brutto"],
          currency: payment["currency"]["name"],
        },
      })
      .afterClosed()
      .pipe(
        switchMap((sw) => {
          if (sw !== undefined) {
            this.isPending = true;
            let pDate = sw.substring(0, 10);
            return this.invoicePaymentStatusService.paymentConfirmation(
              payment["invoiceId"],
              pDate
            );
          } else {
            this.isPending = false;
            return empty();
          }
        }),
        take(1)
      )

      .subscribe((s) => {
        arr.splice(arr.indexOf(payment), 1);
        this.isPending = false;
      });
  }

  filterArr(str: string, arr: any[]): any[] {
    if (arr == undefined || arr.length == 0 || str == undefined) {
      return [];
    }
    str.toLowerCase();
    return arr.filter((f) => {
      let address = f["company"]["address"].toLowerCase();
      let vat = f["company"]["vatId"];
      let contact = f["company"]["contact"].toLowerCase();
      let shortName = f["company"]["shortName"].toLowerCase();
      let curr = f["currency"]["name"].toLowerCase();

      let res = address + vat + contact + shortName + curr;
      return res.includes(str);
    });
  }
}