import { InvoiceSellService } from "../services/invoice-sell.service";
import { IDetailObj } from "../../../../shared/idetail-obj";
import { INavDetailInfo } from "../../../../shared/interfaces/inav-detail-info";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IBasicActions } from "app/shared/ibasic-actions";
import { FormControl } from "@angular/forms";
import { saveAs } from "file-saver";
import { Subject, empty, EMPTY, noop } from "rxjs";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import {
  CurrencyCommonService,
  CURRENCY_LIST,
} from "app/other-modules/currency/currency-common.service";
import { ICurrencyNbp } from "app/other-modules/currency/interfaces/i-currency-nbp";

import {
  IInvoiceExtraInfoChecked,
  IInvoiceLineGroup,
  IInvoiceSell,
} from "../../interfaces/iinvoice-sell";
import {
  map,
  takeUntil,
  debounceTime,
  switchMap,
  take,
  finalize,
  distinctUntilChanged,
  tap,
} from "rxjs/operators";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { IInvoicePos } from "../../interfaces/iinvoice-pos";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { Location } from "@angular/common";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { IDialogTakNie } from "app/other-modules/dialog-confirmations/interfaces/i-dialog-tak-nie";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";
import { twoDigitsFormat } from "app/common-functions/format/two-digits-format";

@Component({
  selector: "app-invoice-sell",
  templateUrl: "./invoice-sell.component.html",
  styleUrls: ["./invoice-sell.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceSellComponent implements OnInit, OnDestroy, IDetailObj {
  currencyData = CURRENCY_LIST.find(
    (currency: ICurrency) => currency.name === "PLN"
  );
  currencyNbpData = {} as ICurrencyNbp;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  isFormReady = false;
  isPending = false;
  correctionTotalInfoValueStyle: string;
  dataObj: any;
  navActions: IBasicActions;
  rForm: FormGroup;
  routeId: number;

  constructor(
    private actRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private dateTimeService: DateTimeCommonServiceService,
    private df: InvoiceSellService,
    private currService: CurrencyCommonService,
    private dialogConfirmationService: DialogConfirmationsService,
    private icf: InvoiceCommonFunctionsService,
    private fb: FormBuilder,
    private location: Location,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.initRouteId();
    this.invoiceVatValueWatch();
    this.initData();
  }

  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      subtitle: "Tworzenie, edycja, szczegóły",
      title: "Faktura sprzedaży",
    },
    basicActions: {},
  };

  //#region  init, start

  initForm(): void {
    this.rForm = this.icf.formInvoiceSellGroup(this.fb, this.isDestroyed$);
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

    this.sellingDate.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.paymentTerms.get("day0").patchValue(s, { emitEvent: true });
      });

    //total brutto in words - checkbox change
    this.extraInfo
      .get("is_in_words")
      .valueChanges.pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.extraInfoTtotalBruttoInWords.patchValue(this.prepTotalInWord());
      });

    this.invoiceTotalCurrent.valueChanges
      .pipe(debounceTime(500), takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.extraInfoTtotalBruttoInWords.setValue(this.prepTotalInWord());
      });

    this.extraInfoIsTaxNbpExchanged.valueChanges
      .pipe(
        tap((isExtraInfoNbp: boolean) => {
          if (!isExtraInfoNbp) return;

          this.currencyNbpData = {
            ...this.currencyNbpData,
            currency: this.currency.value,
            price: this.totalTax.value,
            rateDate: this.sellingDate.value,
          };
        })
      )
      .subscribe(noop);
  }

  initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
    });
  }

  initData(): void {
    this.isPending = true;
    if (this.routeId > 0) {
      this.df
        .getById(this.routeId)
        .pipe(
          takeUntil(this.isDestroyed$),
          finalize(() => {
            this.isPending = false;
          })
        )
        .subscribe((s: IInvoiceSell) => {
          this.isFormReady = true;
          this.navDetailInfo.basicActions.canDelete = true;
          this.icf.patchInvoiceSell(s, this.rForm, this.fb);
          this.currencyData = s.currency;
          this.currencyNbpData = s.extraInfo.currencyNbp;
          this.toastService.toastMake(`Pobrano dane : ${s.invoiceNo}`, "init");
          this.rForm.markAsPristine();
          this.changeDetectorRef.detectChanges();
        });
    } else {
      this.isFormReady = true;
      this.isPending = false;
      this.invoicePosAdd();
      this.rForm.markAsPristine();
      this.changeDetectorRef.detectChanges();
    }
  }

  navCancel(): void {
    throw new Error("Not implemented yet.");
  }

  navDownload(): void {
    throw new Error("Not implemented yet.");
  }

  navDelete(): void {
    const data = {
      title: "Faktura sprzedaży",
      question: `Czy na pewno usunąć dokument nr: ${this.rForm.value.invoiceNo} ? \n Dokumnet zostanie trwale usunięty z bazy bez możliwośći jego przywrcenia`,
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(
        switchMap((dialogResponse) => {
          if (dialogResponse) {
            this.toastService.toastMake("Usuwam dane", "navDelete");
            return this.df.delete(this.rForm.value.invoiceSellId);
          } else {
            return empty();
          }
        }),
        take(1),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.toastService.toastMake("Usunięto dane", "init");
        this.location.back();
      });
  }

  navSave(): void {
    this.isPending = true;
    let id = this.invoiceSellId.value;

    if (!this.isCorrection.value) {
      //setting corrections, original brutto_value, vat_value etc to 0..
      this.prepZeroValuesLinesForNonCorrectionInvoice();
    }
    this.df
      .update(id, this.rForm.value)
      .pipe(
        take(1),
        takeUntil(this.isDestroyed$),
        finalize(() => {
          this.isPending = false;
        })
      )
      .subscribe((s) => {
        this.toastService.toastMake("Zaktualizowano dane", "navSave");
        this.icf.patchInvoiceSell(s, this.rForm, this.fb);
        this.rForm.markAsPristine();
      });
  }

  //#endregion

  //#region Invoice

  invoicePosAdd(): void {
    this.icf.lineAdd(this.invoiceLines, this.fb);
  }

  invoicePosRemove(idx: number): void {
    this.icf.lineRemove(idx, this.rForm, this.invoiceLines, this.isDestroyed$);
  }

  invoiceLineUpdated(): void {
    this.df
      .calcRates(this.rForm.value)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((_data: any) => {
        this.icf.patchInvoiceRates(_data.rates, this.rates, this.fb);
        this.icf.patchInvoiceTotal(
          _data.invoiceTotal,
          this.invoiceTotal,
          this.fb
        );
        this.getCorrectionPaymenntInfo.setValue(
          _data.getCorrectionPaymenntInfo,
          { emitEvent: false }
        );
        this.getInvoiceValue.setValue(_data.getInvoiceValue, {
          emitEvent: false,
        });
        this.icf.getInvoiceLinesCorrections(
          _data.invoiceLines,
          this.invoiceLines
        );
      });
  }

  invoiceClone(): void {
    const data = {
      title: "Faktura sprzedaży klonik",
      question: "Czy skopiować dane do nowotworzonej faktury ?",
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        if (s) {
          this.invoiceSellId.setValue(0);
          this.invoiceNo.setValue("clone - nowa");
          this.creationInfo.reset();
          this.rForm.markAsDirty();
        }
      });
  }

  invoiceVatValueWatch(): void {
    this.invoiceLines.valueChanges
      .pipe(
        debounceTime(2000),
        map((m: IInvoiceLineGroup[]) =>
          m.map((m) => m.current).filter((f) => f.vat_rate == "-")
        ),
        takeUntil(this.isDestroyed$)
      )
      .subscribe(
        (_invoicePos: IInvoicePos[]) => {
          if (_invoicePos.length > 0) {
            this.info.setValue("Reverse charge", { emitEvent: false });
            this.toastService.toastMake(
              'Wartość pola "UWAGI" zmieniona na: "Reverse charge"',
              "asdf"
            );
          }
        },
        (error) => console.log("invoiceLines error", error)
      );
  }

  printInvoice(): void {
    this.isPending = true;

    const data = {
      question:
        "Czy zaktualizować status - potwierdzenie wysłania faktury ? UWAGA: Aktualizacja NIE zostaje automatycznie zapisana w bazie",
      title: "Wydruk faktury",
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(
        switchMap((takNie: boolean) => {
          if (takNie === true) {
            if (
              this.isTransportOffer &&
              this.extraInfoCheckedCmr.value &&
              this.extraInfoCheckedCmr.value.checked !== true
            ) {
              this.extraInfoCheckedCmr.patchValue({
                checked: true,
                date: this.dateTimeService.getToday(),
                info: "auto print faktury",
              } as IInvoiceExtraInfoChecked);
            }

            this.extraInfoCheckedSent.patchValue({
              checked: true,
              date: this.dateTimeService.getToday(),
              info: "auto print faktury",
            } as IInvoiceExtraInfoChecked);

            this.rForm.markAsDirty();
          }
          return this.df.printInvoice(this.rForm.value).pipe(
            map((res) => {
              return new Blob([res, "application/pdf"], {
                type: "application/pdf",
              });
            }),
            takeUntil(this.isDestroyed$),
            finalize(() => (this.isPending = false))
          );
        })
      )
      .subscribe((s) => {
        saveAs(s, `Faktura.pdf`);
        this.toastService.toastMake(
          "Faktura została wygenerowana",
          "printInvoice"
        );
      });
  }

  getCurrencyNbpExchange(): ICurrencyNbp {
    return <ICurrencyNbp>{
      currency: this.currency.value,
      rateDate: this.sellingDate.value,
      price: this.icf.roundToCurrency(
        this.invoiceTotalCurrent.get("total_tax").value
      ),
    };
  }

  prepTotalInWord(): string {
    let totalBrutto: number = 0;
    if (this.isCorrection.value) {
      totalBrutto = this.getInvoiceValue.value;
    } else {
      totalBrutto = this.totalBrutto.value;
    }
    let inStr = this.icf.roundToCurrency(totalBrutto).toString();
    inStr.indexOf(",");
    let commaIdx = inStr.indexOf(".");
    let rest: string = "00";
    if (commaIdx > 0) {
      if (inStr.length - commaIdx == 2) {
        rest = `${inStr.slice(commaIdx + 1, inStr.length)}0`;
      } else {
        rest = inStr.slice(commaIdx + 1, inStr.length);
      }
    }
    return `${this.icf.inWords(totalBrutto)} ${rest}/100 ${
      this.currency.value.name
    }`;
  }

  prepExtraInfoTaxExchangedNbp(currNbp: ICurrencyNbp): void {
    const netto = twoDigitsFormat(this.totalNetto.value);
    const nettoPLN = twoDigitsFormat(this.totalNetto.value * currNbp.rate);
    const brutto = twoDigitsFormat(this.totalBrutto.value);
    const bruttoPLN = twoDigitsFormat(this.totalBrutto.value * currNbp.rate);
    const tax = twoDigitsFormat(this.totalTax.value);
    const taxPLN = twoDigitsFormat(this.totalTax.value * currNbp.rate);

    const TAX =
      this.totalTax.value === 0
        ? ""
        : `||| Podatek VAT (${tax}) wartość: ${taxPLN} PLN;`;

    const BASIC_EXCHANGE_INFO = this.currService.prepCombinedInfoNbp(currNbp);

    const INFO = `${BASIC_EXCHANGE_INFO} ||| Netto (${netto}) wartość: ${nettoPLN} PLN ${TAX} ||| Brutto (${brutto}) wartość: ${bruttoPLN} PLN `;

    this.extraInfoTaxExchangedInfo.setValue(INFO);
  }

  prepCorrectionOriginalData(): void {
    this.invoiceLines.controls.forEach((g) => {
      let original = g.get("original");
      let current = g.get("current");
      let corr = g.get("corrections");
      current
        .get("baseInvoiceLineId")
        .setValue(current.get("invoice_pos_id").value, { emitEvent: false });
      current.get("isCorrected").setValue(false, { emitEvent: false });
      original.setValue(current.value, { emitEvent: false });
    });
  }

  prepZeroValuesLinesForNonCorrectionInvoice(): void {
    this.invoiceLines.controls.forEach((line) => {
      line
        .get("corrections")
        .patchValue(this.icf.getIInvoiceLine("none"), { emitEvent: false });
      line
        .get("original")
        .patchValue(this.icf.getIInvoiceLine("none"), { emitEvent: false });
    });
  }

  createCorrection(): void {
    this.prepCorrectionOriginalData();
    this.correctionTotalInfoFc.setValue(null);
    this.invoiceNo.setValue(null);
    this.invoiceOriginalPaid.setValue(this.paymentIsDone.value, {
      emitEvent: false,
    });
    this.isCorrection.setValue(true);
  }

  refreshExtraInfoNbp(): void {
    this.prepExtraInfoTaxExchangedNbp(this.currencyNbpFG.value);
  }

  //#endregion

  //#region geters

  get baseInvoiceId(): FormControl {
    return this.rForm.get("baseInvoiceId") as FormControl;
  }

  get companyBuyer(): FormGroup {
    return this.rForm.get("companyBuyer") as FormGroup;
  }

  get companySeller(): FormGroup {
    return this.rForm.get("companySeller") as FormGroup;
  }

  get creationInfo(): FormGroup {
    return this.rForm.get("creationInfo") as FormGroup;
  }

  get correctionId(): FormControl {
    return this.rForm.get("correctionId") as FormControl;
  }

  get correctionTotalInfoFc(): FormControl {
    return this.rForm.get("correctionTotalInfo") as FormControl;
  }

  get currency(): FormControl {
    return this.rForm.get("currency") as FormControl;
  }

  get currencyNbpFG(): FormGroup {
    return this.rForm.get("extraInfo.currencyNbp") as FormGroup;
  }

  get extraInfo(): FormGroup {
    return this.rForm.get("extraInfo") as FormGroup;
  }

  get extraInfoCheckedCmr(): FormGroup {
    return this.rForm.get("extraInfo.cmr") as FormGroup;
  }

  get extraInfoCheckedRecived(): FormGroup {
    return this.rForm.get("extraInfo.recived") as FormGroup;
  }

  get extraInfoCheckedSent(): FormGroup {
    return this.rForm.get("extraInfo.sent") as FormGroup;
  }
  get extraInfoIsTaxNbpExchanged(): FormControl {
    return this.rForm.get("extraInfo.is_tax_nbp_exchanged") as FormControl;
  }
  get extraInfoTaxExchangedInfo(): FormControl {
    return this.rForm.get("extraInfo.tax_exchanged_info") as FormControl;
  }

  get extraInfoTtotalBruttoInWords(): FormControl {
    return this.rForm.get("extraInfo.total_brutto_in_words") as FormControl;
  }

  get getCorrectionPaymenntInfo(): FormControl {
    return this.rForm.get("getCorrectionPaymenntInfo") as FormControl;
  }

  get getInvoiceValue(): FormControl {
    return this.rForm.get("getInvoiceValue") as FormControl;
  }

  get info(): FormControl {
    return this.rForm.get("info") as FormControl;
  }

  get invoiceSellId(): FormControl {
    return this.rForm.get("invoiceSellId") as FormControl;
  }

  get invoiceNo(): FormControl {
    return this.rForm.get("invoiceNo") as FormControl;
  }

  get invoiceOriginalNo(): FormControl {
    return this.rForm.get("invoiceOriginalNo") as FormControl;
  }
  get invoiceOriginalPaid(): FormControl {
    return this.rForm.get("invoiceOriginalPaid") as FormControl;
  }

  get isCorrection(): FormControl {
    return this.rForm.get("isCorrection") as FormControl;
  }

  get isCurrencyNotPln(): boolean {
    const currency = this.rForm.get("currency") as FormControl;

    return (
      currency &&
      currency.value &&
      currency.value.name &&
      currency.value.name !== "PLN"
    );
  }

  get isCurrencyNbpPanel(): boolean {
    return this.isCurrencyNotPln && this.extraInfoIsTaxNbpExchanged.value;
  }

  get isLoad(): boolean {
    return this.rForm.get("extraInfo.is_load_no").value;
  }

  get isTransportOffer(): boolean {
    return this.rForm.get("extraInfo.transportOfferId").value;
  }

  get invoiceLines(): FormArray {
    return <FormArray>this.rForm.get("invoiceLines");
  }

  get invoiceCorrectionsLines(): FormGroup {
    return this.rForm.get("invoiceLines.corrections") as FormGroup;
  }

  get invoiceCurrentLines(): FormGroup {
    return this.rForm.get("invoiceLines.current") as FormGroup;
  }

  get invoiceOriginalLines(): FormGroup {
    return this.rForm.get("invoiceLines.original") as FormGroup;
  }

  get paymentDate(): FormControl {
    return this.rForm.get("paymentDate") as FormControl;
  }

  get paymentIsDone(): FormControl {
    return this.rForm.get("paymentIsDone") as FormControl;
  }

  get paymentTerms(): FormGroup {
    return this.rForm.get("paymentTerms") as FormGroup;
  }

  get paymentIsTermsPaymentDays(): FormControl {
    return this.rForm.get("paymentTerms.paymentDays") as FormControl;
  }

  get invoiceTotal(): FormGroup {
    return this.rForm.get("invoiceTotal") as FormGroup;
  }

  get invoiceTotalCorrections(): FormGroup {
    return this.rForm.get("invoiceTotal.corrections") as FormGroup;
  }

  get invoiceTotalCurrent(): FormGroup {
    return this.rForm.get("invoiceTotal.current") as FormGroup;
  }

  get invoiceTotalOriginal(): FormGroup {
    return this.rForm.get("invoiceTotal.original") as FormGroup;
  }

  get rates(): FormArray {
    return <FormArray>this.rForm.get("rates");
  }

  get sellingDate(): FormControl {
    return this.rForm.get("dateOfSell") as FormControl;
  }

  get totalBrutto(): FormControl {
    return this.rForm.get("invoiceTotal.current.total_brutto") as FormControl;
  }

  get totalNetto(): FormControl {
    return this.rForm.get("invoiceTotal.current.total_netto") as FormControl;
  }

  get totalTax(): FormControl {
    return this.rForm.get("invoiceTotal.current.total_tax") as FormControl;
  }

  //#endregion
}
