import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { empty, merge, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { OnDestroy } from "@angular/core";
import { PaymentRemindDialogComponent } from "../payment-remind-dialog/payment-remind-dialog.component";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { InvoicesPaymentStatusService } from "../../services/invoices-payment-status.service";
import { IInvoicePaymentStatusInfo } from "../../interfaces/i-invoice-payment-status-info";
import { IInvoicePaymentStatus } from "../../interfaces/i-invoice-payment-status";
import { IInvoicesPaymentStatusConfirmDialogData } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data";
import { IInvoicesPaymentStatusConfirmDialogDataReturn } from "../../interfaces/i-invoices-payment-status-confirm-dialog-data-return";
import { IInvoiceStatusConfirmation } from "../../interfaces/i-invoice-status-confirmation";
import { InvoiceStatusConfirmationType } from "../../interfaces/invoice-status-confirmation-type";
import { IInvoicePaymentStatusInfoStats } from "../../interfaces/i-invoice-payment-status-info-stats";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

@Component({
  selector: "app-invoices-payment-status",
  templateUrl: "./invoices-payment-status.component.html",
  styleUrls: ["./invoices-payment-status.component.css"],
})
export class InvoicesPaymentStatusComponent implements OnInit, OnDestroy {
  @ViewChild("viewport") viewport?: CdkVirtualScrollViewport;
  isDestroyed$ = new Subject() as Subject<boolean>;
  isPending: boolean;

  itemSize = 130;
  itemsOnViewport = 5;

  confirmations = [] as IInvoicePaymentStatusInfo[];
  confirmationsChanged$ = new Subject() as Subject<boolean>;
  confirmationsFiltered = [] as IInvoicePaymentStatusInfo[];
  confirmationSearch$ = new FormControl();

  unpaid = [] as IInvoicePaymentStatusInfo[];
  unpaidFiltered = [] as IInvoicePaymentStatusInfo[];
  unpaidSearch$ = new FormControl() as FormControl;
  unpaidStats: IInvoicePaymentStatusInfoStats[];

  unpaidOverdue = [] as IInvoicePaymentStatusInfo[];
  unpaidOverdueFiltered = [] as IInvoicePaymentStatusInfo[];
  unpaidOverdueSearch$ = new FormControl() as FormControl;
  unpaidOverdueStats: IInvoicePaymentStatusInfoStats[];

  notConfirmed = [] as IInvoicePaymentStatusInfo[];
  notConfirmedFiltered = [] as IInvoicePaymentStatusInfo[];
  notConfirmedSearch$ = new FormControl() as FormControl;
  notConfirmedStats: IInvoicePaymentStatusInfoStats[];

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
    this.initData();
    this.initObservables();
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

  initObservables() {
    this.unpaidSearch$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.unpaidFiltered = this.filterArr(s, this.unpaid);
      });

    this.unpaidOverdueSearch$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.unpaidOverdueFiltered = this.filterArr(s, this.unpaidOverdue);
      });

    this.notConfirmedSearch$.valueChanges
      .pipe(
        debounceTime(750),
        distinctUntilChanged(),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.notConfirmedFiltered = this.filterArr(s, this.notConfirmed);
      });

    const CONFIRMATION_FORM_CONTROL = (initSearchValue) =>
      this.confirmationSearch$.valueChanges.pipe(
        startWith(initSearchValue),
        debounceTime(750),
        distinctUntilChanged(),
        map((search: string) => {
          return search && search.length > 2 ? search : null;
        }),
        takeUntil(this.isDestroyed$)
      );

    this.confirmationsChanged$
      .pipe(
        switchMap(() =>
          CONFIRMATION_FORM_CONTROL(this.confirmationSearch$.value)
        ),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (confirmationSearch: string) => {
          this.confirmationsFiltered = confirmationSearch
            ? this.filterArr(confirmationSearch, this.confirmations)
            : [];
        },
        (error) => console.log("confirmationSearch error", error),
        () => console.log("confirmationSearch completed..")
      );
  }

  prepData(paymentStatus: IInvoicePaymentStatus) {
    this.unpaid = paymentStatus.unpaid;
    this.unpaidFiltered = paymentStatus.unpaid;
    this.unpaidStats = paymentStatus.unpaidStats;

    this.unpaidOverdue = paymentStatus.unpaidOverdue;
    this.unpaidOverdueFiltered = [...paymentStatus.unpaidOverdue];
    this.unpaidOverdueStats = paymentStatus.unpaidOverdueStats;

    this.notConfirmed = paymentStatus.notConfirmed;
    this.notConfirmedFiltered = paymentStatus.notConfirmed;
    this.notConfirmedStats = paymentStatus.notConfirmedStats;
    this.confirmations = [
      ...this.unpaid,
      ...this.unpaidOverdue,
      ...this.notConfirmed,
    ];
    this.confirmationsChanged$.next(true);
  }

  private filterArr(
    str: string,
    arr: IInvoicePaymentStatusInfo[]
  ): IInvoicePaymentStatusInfo[] {
    if (arr == undefined || arr.length == 0 || str == undefined) {
      return [];
    }
    str.toLowerCase();
    return arr.filter((f: IInvoicePaymentStatusInfo) => {
      const address = f.company.address.toLowerCase();
      const vat = f.company.vatId;
      const invNo = f.invoiceNo;
      const contact = f.company.contact.toLowerCase();
      const shortName = f.company.shortName.toLowerCase();
      const curr = f.currency.name.toLowerCase();

      const res = address + vat + contact + invNo + shortName + curr;
      return res.includes(str);
    });
  }
}
