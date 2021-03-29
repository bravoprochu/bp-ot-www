import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { empty, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { OnDestroy } from "@angular/core";
import { PaymentRemindDialogComponent } from "../payment-remind-dialog/payment-remind-dialog.component";
import { finalize, map, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { InvoicesPaymentStatusService } from "../../services/invoices-payment-status.service";
import { IInvoicePaymentStatusInfo } from "../../interfaces/i-invoice-payment-status-info";
import { IInvoicePaymentStatus } from "../../interfaces/i-invoice-payment-status";
import { IInvoicesPaymentStatusConfirmDialogData } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data";
import { IInvoicesPaymentStatusConfirmDialogDataReturn } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data-return";
import { IInvoiceStatusConfirmation } from "../../interfaces/i-invoice-status-confirmation";
import { InvoiceStatusConfirmationType } from "../../interfaces/invoice-status-confirmation-type";

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

  confirmCommon(
    g: IInvoicePaymentStatusInfo,
    dialogData: IInvoicesPaymentStatusConfirmDialogData,
    confirmType: InvoiceStatusConfirmationType
  ) {
    return this.dialog
      .open(PaymentRemindDialogComponent, { data: dialogData })
      .afterClosed()
      .pipe(
        tap(() => (this.isPending = true)),
        switchMap(
          (
            dialogResponse: IInvoicesPaymentStatusConfirmDialogDataReturn | null
          ) => {
            if (dialogResponse) {
              return this.invoicePaymentStatusService.confirmation(
                g.invoiceId,
                {
                  ...(dialogResponse as IInvoicesPaymentStatusConfirmDialogDataReturn),
                  confirmationType: confirmType,
                } as IInvoiceStatusConfirmation
              );
            } else {
              return empty();
            }
          }
        ),
        take(1),
        takeUntil(this.isDestroyed$),
        map((updatedPaymentStatus: IInvoicePaymentStatus) => {
          if (updatedPaymentStatus) {
            this.prepData(updatedPaymentStatus);
          }
        }),
        finalize(() => (this.isPending = false))
      );
  }

  confirmDefaultSubtitle(g: IInvoicePaymentStatusInfo): string {
    return `${g.company.shortName}, ${g.invoiceNo}, [${g.invoiceTotal.total_netto} ${g.currency.name} (netto)]`;
  }

  confirmCmr(g: IInvoicePaymentStatusInfo) {
    const dialogData = {
      isInfo: true,
      title: "CMR - potwierdzenie odebrania dokumentu.",
      subtitle: this.confirmDefaultSubtitle(g),
    } as IInvoicesPaymentStatusConfirmDialogData;

    this.confirmCommon(g, dialogData, "Cmr").subscribe(
      (cmrSent: any) => {
        console.log("cmrSent subs:", cmrSent);
      },
      (error) => console.log("cmrSent error", error),
      () => console.log("cmrSent completed..")
    );
  }

  confirmInvSent(g: IInvoicePaymentStatusInfo) {
    const dialogData = {
      isInfo: true,
      title: "FV - potwierdzenie nadania dokumentu.",
      subtitle: this.confirmDefaultSubtitle(g),
    } as IInvoicesPaymentStatusConfirmDialogData;

    this.confirmCommon(g, dialogData, "InvoiceSent").subscribe(
      (cmrSent: any) => {
        console.log("InvoiceSent subs:", cmrSent);
      },
      (error) => console.log("invoiceSent error", error),
      () => console.log("invoiceSent completed..")
    );
  }

  confirmInvReceived(g: IInvoicePaymentStatusInfo) {
    const dialogData = {
      isInfo: true,
      title: "FV - potwierdzenie otrzymania dokumentu.",
      subtitle: this.confirmDefaultSubtitle(g),
    } as IInvoicesPaymentStatusConfirmDialogData;

    this.confirmCommon(g, dialogData, "InvoiceReceived").subscribe(
      (cmrSent: any) => {
        console.log("invoiceReceived subs:", cmrSent);
      },
      (error) => console.log("invoiceReceived error", error),
      () => console.log("invoiceReceived completed..")
    );
  }

  confirmPayment(g: IInvoicePaymentStatusInfo): void {
    const dialogData = {
      isInfo: false,
      title: "Potwierdzenie opłacenia faktury",
      subtitle: this.confirmDefaultSubtitle(g),
    } as IInvoicesPaymentStatusConfirmDialogData;

    this.confirmCommon(g, dialogData, "Payment").subscribe(
      (cmrSent: any) => {
        console.log("Payment subs:", cmrSent);
      },
      (error) => console.log("Payment error", error),
      () => console.log("Payment completed..")
    );
  }

  initData() {
    this.isPending = true;
    this.invoicePaymentStatusService
      .paymentRemind()
      .pipe(take(1))
      .subscribe((s: IInvoicePaymentStatus) => {
        this.prepData(s);
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

  prepData(paymentStatus: IInvoicePaymentStatus) {
    this.unpaid = paymentStatus.unpaid;
    this.unpaidFiltered = paymentStatus.unpaid;
    this.unpaidStats = paymentStatus.unpaidOverdueStats;

    this.unpaidOverdue = paymentStatus.unpaidOverdue;
    this.unpaidOverdueFiltered = [...paymentStatus.unpaidOverdue];
    this.unpaidOverdueStats = paymentStatus.unpaidOverdueStats;

    this.notConfirmed = paymentStatus.notConfirmed;
    this.notConfirmedFiltered = paymentStatus.notConfirmed;
    this.notConfirmedStats = paymentStatus.notConfirmedStats;
  }

  private filterArr(str: string, arr: any[]): any[] {
    if (arr == undefined || arr.length == 0 || str == undefined) {
      return [];
    }
    str.toLowerCase();
    return arr.filter((f: IInvoicePaymentStatusInfo) => {
      const address = f.company.address.toLowerCase();
      const vat = f.company.vatId;
      const contact = f.company.contact.toLowerCase();
      const shortName = f.company.shortName.toLowerCase();
      const curr = f.currency.name.toLowerCase();

      const res = address + vat + contact + shortName + curr;
      return res.includes(str);
    });
  }
}
