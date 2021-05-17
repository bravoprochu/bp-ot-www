import { Component, OnInit, ViewChild } from "@angular/core";
import { empty, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { OnDestroy } from "@angular/core";
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
import { IDialogDateConfirmationReturn } from "../../../dialog-confirmations/interfaces/i-dialog-date-confirmation-return";
import { IInvoiceStatusConfirmation } from "../../interfaces/i-invoice-status-confirmation";
import { InvoiceStatusConfirmationType } from "../../interfaces/invoice-status-confirmation-type";
import { IInvoicePaymentStatusInfoStats } from "../../interfaces/i-invoice-payment-status-info-stats";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { IDialogDateConfirmation } from "app/other-modules/dialog-confirmations/interfaces/i-dialog-date-confirmation";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { DataExportsService } from "app/other-modules/data-exports/services/data-exports.service";
import { saveAs } from "file-saver";
import { IInvoicePaymentStatusCsv } from "../../interfaces/i-invoice-payment-status-csv";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { TWO_DIGITS_FORMAT } from "app/common-functions/format/two-digits-format";

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
    private dateTimeService: DateTimeCommonServiceService,
    private dataExportService: DataExportsService,
    private dialogConfirmationService: DialogConfirmationsService,
    private invoicePaymentStatusService: InvoicesPaymentStatusService
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
    dialogData: IDialogDateConfirmation,
    confirmType: InvoiceStatusConfirmationType
  ) {
    return this.dialogConfirmationService
      .getDateConfirmationDialog(dialogData)
      .pipe(
        tap(() => (this.isPending = true)),
        switchMap((dialogResponse: IDialogDateConfirmationReturn | null) => {
          if (dialogResponse) {
            return this.invoicePaymentStatusService.confirmation(g.invoiceId, {
              ...(dialogResponse as IDialogDateConfirmationReturn),
              confirmationType: confirmType,
            } as IInvoiceStatusConfirmation);
          } else {
            return empty();
          }
        }),
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
    } as IDialogDateConfirmation;

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
    } as IDialogDateConfirmation;

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
    } as IDialogDateConfirmation;

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
    } as IDialogDateConfirmation;

    this.confirmCommon(g, dialogData, "Payment").subscribe(
      (cmrSent: any) => {
        console.log("Payment subs:", cmrSent);
      },
      (error) => console.log("Payment error", error),
      () => console.log("Payment completed..")
    );
  }

  genCsvReport(title: string, data: IInvoicePaymentStatusInfo[]): void {
    const DATA_TO_EXPORT = data.map(
      (payment: IInvoicePaymentStatusInfo) =>
        ({
          czyCmrOtrzymana: payment.IsCmrReceived,
          czyFakturaNaBazieTransportu: payment.isTransportOrLoadInvoice,
          czyFakturaOtrzymana: payment.IsInvoiceReceived,
          czyFakturaWyslana: payment.IsInvoiceSent,
          dataSprzedazy: this.dateTimeService.formatYYYYMMDD(
            payment.dateOfSell
          ),
          dataWystawienia: this.dateTimeService.formatYYYYMMDD(
            payment.dateOfIssue
          ),
          dniPrzedawnione: payment.daysOverdue,
          fakturaNr: payment.invoiceNo,
          fakturaSystemId: payment.invoiceId,
          kontrahentAdres: payment.company.address,
          kontrahentNazwa: payment.company.shortName,
          kontrahentNip: payment.company.vatId,
          razemBrutto: TWO_DIGITS_FORMAT(payment.invoiceTotal.total_brutto),
          razemNetto: TWO_DIGITS_FORMAT(payment.invoiceTotal.total_netto),
          razemVat: TWO_DIGITS_FORMAT(payment.invoiceTotal.total_tax),
          terminPlatnosci: this.dateTimeService.formatYYYYMMDD(
            payment.paymentDate
          ),
          terminPlatnosciIleDni: payment.paymentDays,
          waluta: payment.currency.name,
        } as IInvoicePaymentStatusCsv)
    );

    const KEYS = Object.keys(DATA_TO_EXPORT[0]).map((key) => key);

    console.log(DATA_TO_EXPORT);
    const BLOB = new Blob(
      [this.dataExportService.csvConverter(DATA_TO_EXPORT, KEYS)],
      {
        type: "text/csv;charset=utf-8;",
      }
    );
    const FILENAME = `${title}_${this.dateTimeService.formatYYYYMMDTHHMMSS(
      this.dateTimeService.getNow()
    )}`;
    saveAs(BLOB, `${FILENAME}.csv`);
  }

  initData() {
    this.isPending = true;
    this.invoicePaymentStatusService
      .paymentRemind()!
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
    this.unpaidOverdueFiltered = [...paymentStatus?.unpaidOverdue];
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
