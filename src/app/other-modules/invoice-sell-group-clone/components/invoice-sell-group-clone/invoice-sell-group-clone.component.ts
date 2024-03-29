import { Component, OnInit, OnDestroy } from "@angular/core";

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { FormGroup, FormControl } from "@angular/forms";
import { IDialogTakNie } from "app/other-modules/dialog-confirmations/interfaces/i-dialog-tak-nie";
import { empty, Subject } from "rxjs";
import { take, switchMap, takeUntil, startWith } from "rxjs/operators";
import { IInvoiceSellLineList } from "../../../invoices/interfaces/i-invoice-line-list";
import { IInvoiceSellGroupClone } from "../../../invoices/interfaces/i-invoice-sell-group-clone";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { InvoiceSellGroupCloneService } from "../../services/invoice-sell-group-clone.service";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";

@Component({
  selector: "app-invoice-sell-group-clone",
  templateUrl: "./invoice-sell-group-clone.component.html",
  styleUrls: ["./invoice-sell-group-clone.component.css"],
})
export class InvoiceSellGroupCloneComponent implements OnInit, OnDestroy {
  isDestroyed$ = new Subject<boolean>();
  invoiceLine = new FormGroup({});
  invoiceList = [] as IInvoiceSellLineList[];
  invoiceListRest = [] as IInvoiceSellLineList[];
  isPending = true;
  productName = new FormControl(null);
  dateOfSell = new FormControl(this.dateTimeService.getToday());
  dateOfIssue = new FormControl(this.dateTimeService.getToday());
  monthsAgo = new FormControl(1);

  constructor(
    private dateTimeService: DateTimeCommonServiceService,
    private dialogConfirmationService: DialogConfirmationsService,
    private invoiceGroupCloneService: InvoiceSellGroupCloneService,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.initData();
  }

  copyToProductName(text: string) {
    this.productName.setValue(text);
  }

  drop(ev: CdkDragDrop<IInvoiceSellLineList[]>) {
    if (ev.previousContainer == ev.container) {
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    } else {
      transferArrayItem(
        ev.previousContainer.data,
        ev.container.data,
        ev.previousIndex,
        ev.currentIndex
      );
    }
  }

  gapIfEmpty(): number {
    return this.invoiceListRest.length > 0 ? 0 : 30;
  }

  save(invoiceList: IInvoiceSellLineList[]) {
    let dataToPost = {
      dateOfIssue: this.dateOfIssue.value,
      dateOfSell: this.dateOfSell.value,
      invoiceList: invoiceList,
      productName: this.productName.value,
    } as IInvoiceSellGroupClone;

    this.isPending = true;

    const data = {
      title: "Faktura sprzedaży, klonowanie grupowe",
      question: `Czy na pewno utworzyć klony ${invoiceList.length} faktur ?`,
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(
        switchMap((dialogResponse) => {
          this.toastService.toastMake("Zapisuję dane", "navDelete");
          if (dialogResponse) {
            return this.invoiceGroupCloneService.postInvoiceListToClone(
              dataToPost
            );
          }
          this.isPending = false;
          return empty();
        }),
        take(1)
      )
      .subscribe((s) => {
        this.toastService.toastMake(
          `Utworzono clony dokumentów.. UWAGA: Lista faktur w tabeli nie aktualizuje się automatycznie`,
          "save"
        );
        this.isPending = false;
      });
  }

  flexSize(): number {
    return this.invoiceList.length > 0 && this.invoiceListRest.length > 0
      ? 50
      : 25;
  }

  get getMonthAgo(): string {
    return this.dateTimeService.addToIsoDate(
      this.dateTimeService.getToday(),
      -this.monthsAgo.value,
      "months"
    );
  }

  initData() {
    this.monthsAgo.valueChanges
      .pipe(
        startWith(1),
        takeUntil(this.isDestroyed$),
        switchMap((monthsAgo) => {
          if (!monthsAgo) {
            return empty();
          }
          return this.invoiceGroupCloneService
            .getLastMonthInvoices(this.monthsAgo.value)
            .pipe(take(1));
        })
      )
      .subscribe((_data: any) => {
        this.invoiceList = _data;
        this.isPending = false;
      });
  }
}
