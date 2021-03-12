import { InvoiceBuyService } from "../services/invoice-buy.service";
import { DialogTakNieComponent } from "../../../dialog-tak-nie/components/dialog-tak-nie/dialog-tak-nie.component";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { IDetailObj } from "../../../../shared/idetail-obj";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { IDialogTakNieInfo } from "app/shared/interfaces/idialog-tak-nie-info";
import { empty, Observable } from "rxjs";
import { IInvoiceBuy } from "../../interfaces/iinvoice-buy";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import { Subject } from "rxjs";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { switchMap, take, takeUntil, tap } from "rxjs/operators";
import { Location } from "@angular/common";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";

@Component({
  selector: "app-invoice-sell-buy",
  templateUrl: "./invoice-buy.component.html",
  styleUrls: ["./invoice-buy.component.css"],
})
export class InvoiceBuyComponent implements OnInit, OnDestroy, IDetailObj {
  /**
   *
   */
  constructor(
    private currencyService: CurrencyCommonService,
    private icf: InvoiceCommonFunctionsService,
    private df: InvoiceBuyService,
    private dialogTakNie: MatDialog,
    public fb: FormBuilder,
    private location: Location,
    private actRoute: ActivatedRoute,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      title: "Faktura zakupu",
    },
    basicActions: {
      canNotGoBack: false,
    },
  };

  ngOnInit() {
    this.isPending = true;
    this.isDestroyed$ = new Subject<boolean>();
    this.initForm();
    this.initRouteId();
  }

  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  rForm: FormGroup;
  routeId: number;

  //#region getters

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get("creationInfo");
  }
  get companySeller(): FormGroup {
    return <FormGroup>this.rForm.get("companySeller");
  }
  get companySellerShortName(): FormControl {
    return <FormControl>this.rForm.get("companySeller.short_name");
  }

  get currency(): FormGroup {
    return <FormGroup>this.rForm.get("currency");
  }

  get dateOfIssue(): FormControl {
    return <FormControl>this.rForm.get("dateOfIssue");
  }

  get dateOfSell(): FormControl {
    return <FormControl>this.rForm.get("dateOfSell");
  }

  get isInvoiceReceived(): FormControl {
    return <FormControl>this.rForm.get("isInvoiceReceived");
  }

  get invoiceReceivedDate(): FormControl {
    return <FormControl>this.rForm.get("invoiceReceivedDate");
  }

  get invoiceLines(): FormArray {
    return <FormArray>this.rForm.get("invoiceLines");
  }

  get invoiceTotal(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal");
  }

  get invoiceTotalCurrent(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal.current");
  }

  get isCorrection(): FormControl {
    return <FormControl>this.rForm.get("isCorrection");
  }
  get paymentIsDone(): FormControl {
    return <FormControl>this.rForm.get("paymentIsDone");
  }

  get paymentDate(): FormControl {
    return <FormControl>this.rForm.get("paymentDate");
  }

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get("paymentTerms");
  }

  get paymentTermsDay0(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.day0");
  }
  get paymentTermsPaymentDays(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.paymentDays");
  }

  get rates(): FormArray {
    return <FormArray>this.rForm.get("rates");
  }

  //#endregion

  public initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
      this.initData();
    });
  }

  initData(): void {
    let id = this.routeId;
    if (id > 0) {
      this.df
        .getById(id)
        .pipe(takeUntil(this.isDestroyed$))
        .subscribe((s: IInvoiceBuy) => {
          this.toastService.toastMake(
            `Pobrano dane: ${s.invoiceNo}`,
            "initData"
          );
          this.icf.patchInvoiceBuy(s, this.rForm, this.fb);
          this.navDetailInfo.basicActions.canDelete = true;
          this.isPending = false;
        });
    } else {
      this.isPending = false;
    }
  }

  navCancel(): void {
    throw new Error("Method not implemented.");
  }
  navDownload(): void {
    throw new Error("Method not implemented.");
  }
  public navDelete(): void {
    this.dialogTakNie
      .open(DialogTakNieComponent, {
        data: <IDialogTakNieInfo>{
          title: "Faktura zakupu",
          question: `Czy na pewno usunąć dokument nr: ${this.rForm.value.invoiceNo} ? \n Dokumnet zostanie trwale usunięty z bazy bez możliwośći jego przywrcenia`,
        },
      })
      .afterClosed()
      .pipe(
        switchMap((dialogResponse) => {
          this.toastService.toastMake("Usuwam dane", "navDelete");
          return dialogResponse
            ? this.df.delete(this.rForm.value.invoiceBuyId)
            : empty();
        }),
        take(1)
      )

      .subscribe((s) => {
        this.toastService.toastMake("Usunięto dane", "init");
        this.location.back();
      });
  }

  navSave(): void {
    //this.isPending=true;
    let id = this.rForm.value.invoiceBuyId ? this.rForm.value.invoiceBuyId : 0;
    this.df
      .update(id, this.rForm.value)
      .pipe(
        take(1),
        switchMap((sw: IInvoiceBuy) => {
          this.toastService.toastMake(`Zaktualizowano dane`, "navSave");
          return this.df.getById(id);
        }),
        take(1)
      )

      .subscribe((s: IInvoiceBuy) => {
        this.toastService.toastMake(
          `Pobrano zaktualizowane dane ${s.invoiceNo}, [id: ${s.invoiceBuyId}]`,
          "navSave"
        );
        this.icf.patchInvoiceBuy(s, this.rForm, this.fb);
        this.isPending = false;
        this.rForm.markAsPristine();
      });
  }

  initForm(): void {
    this.rForm = this.icf.formInvoiceBuyGroup(this.fb, this.isDestroyed$);
    this.currency.setValue(this.currencyService.findCurrencyByName("pln"));
    this.paymentTermsPaymentDays.setValue(14, { emitEvent: true });
    this.invoicePosAdd();

    this.dateOfIssue.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.paymentTermsDay0.setValue(s, { emitEvent: true });
      });

    this.paymentIsDone.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        if (s) {
          this.paymentDate.setValidators(Validators.required);
        } else {
          this.paymentDate.clearValidators();
        }
        this.paymentDate.updateValueAndValidity();
      });

    //checkbox if recived
    this.isInvoiceReceived.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        if (s) {
          this.invoiceReceivedDate.setValidators(Validators.required);
        } else {
          this.invoiceReceivedDate.clearValidators();
        }
        this.invoiceReceivedDate.updateValueAndValidity();
      });
  }

  invoiceLineUpdated() {
    this.df
      .calcRates(this.rForm.value)
      .pipe(
        takeUntil(this.isDestroyed$),
        tap(() => this.rForm.markAsDirty())
      )
      .subscribe((_data: any) => {
        this.icf.patchInvoiceRates(_data.rates, this.rates, this.fb);
        this.icf.patchInvoiceTotal(
          _data.invoiceTotal,
          this.invoiceTotal,
          this.fb
        );
      });
  }

  invoicePosAdd() {
    this.icf.lineAdd(this.invoiceLines, this.fb);
  }
  invoicePosRemove(idx: number) {
    this.icf.lineRemove(idx, this.rForm, this.invoiceLines, this.isDestroyed$);
  }
}
