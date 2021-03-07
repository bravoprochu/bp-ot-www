import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Observable } from "rxjs/Observable";
import * as moment from "moment";
import { FormControl } from "@angular/forms";
import { OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { InvoiceSellService } from "../invoice-sell/services/invoice-sell.service";
import { PaymentRemindDialogComponent } from "../payment-remind-dialog/payment-remind-dialog.component";

@Component({
  selector: "app-invoice-sell-payment-remind",
  templateUrl: "./invoice-sell-payment-remind.component.html",
  styleUrls: ["./invoice-sell-payment-remind.component.css"],
})
export class InvoiceSellPaymentRemindComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isAlive = false;
  }

  constructor(private df: InvoiceSellService, private dialog: MatDialog) {}

  ngOnInit() {
    this.isPending = true;
    this.unpaidSearch$ = new FormControl();
    this.unpaidOverdueSearch$ = new FormControl();
    this.notConfirmedSearch$ = new FormControl();
    this.initData();
    this.initForm();
    this.isAlive = true;
  }

  isAlive: Boolean;
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

  initData() {
    this.isPending = true;
    this.df
      .paymentRemind()
      .take(1)
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
      .takeWhile((w) => this.isAlive == true)
      .subscribe((s) => {
        this.unpaidFiltered = this.filterArr(s, this.unpaid);
        this.unpaidFilterInfo =
          s.length > 0
            ? `Zastosowano filtr, znaleziono: ${this.unpaidFiltered.length}`
            : "";
      });

    this.unpaidOverdueSearch$.valueChanges
      .takeWhile((w) => this.isAlive == true)
      .subscribe((s) => {
        this.unpaidOverdueFiltered = this.filterArr(s, this.unpaidOverdue);
        this.unpaidOverdueFilterInfo =
          s.length > 0
            ? `Zastosowano filtr, znaleziono: ${this.unpaidOverdueFiltered.length}`
            : "";
      });

    this.notConfirmedSearch$.valueChanges
      .takeWhile((w) => this.isAlive == true)
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
      .switchMap((sw) => {
        if (sw !== undefined) {
          this.isPending = true;
          let pDate = sw.substring(0, 10);
          return this.df.paymentConfirmation(payment["invoiceId"], pDate);
        } else {
          this.isPending = false;
          return Observable.empty();
        }
      })
      .take(1)
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