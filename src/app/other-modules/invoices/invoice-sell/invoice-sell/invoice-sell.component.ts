import { InvoiceSellService } from "../services/invoice-sell.service";
import { IDetailObj } from "../../../../shared/idetail-obj";
import { INavDetailInfo } from "../../../../shared/interfaces/inav-detail-info";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { IBasicActions } from "app/shared/ibasic-actions";
import { FormControl } from "@angular/forms";
import { saveAs } from "file-saver";
import { Subject, empty } from "rxjs";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
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
} from "rxjs/operators";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { IInvoicePos } from "../../interfaces/iinvoice-pos";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { Location } from "@angular/common";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { IDialogConfTakNieInfo } from "@bpCommonInterfaces/idialog-tak-nie-info";

@Component({
  selector: "app-invoice-sell",
  templateUrl: "./invoice-sell.component.html",
  styleUrls: ["./invoice-sell.component.css"],
})
export class InvoiceSellComponent implements OnInit, OnDestroy, IDetailObj {
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
    private df: InvoiceSellService,
    private currService: CurrencyCommonService,
    private dialogConfirmationService: DialogConfirmationsService,
    private momentService: MomentCommonService,
    private icf: InvoiceCommonFunctionsService,
    public fb: FormBuilder,
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

  public navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      subtitle: "Tworzenie, edycja, szczegóły",
      title: "Faktura sprzedaży",
    },
    basicActions: {},
  };

  //#region  init, start

  public initForm(): void {
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

    this.extraInfoIsTaxNbpExchanged.valueChanges
      .pipe(
        switchMap((_isChecked: boolean) => {
          let _currNbp = <ICurrencyNbp>{
            currency: <ICurrency>this.currency.value,
            price: this.icf.roundToCurrency(this.totalTax.value),
            rateDate: this.sellingDate.value,
          };
          if (_isChecked && (<ICurrencyNbp>this.currencyNbp.value).rate == 0) {
            this.currencyNbp.patchValue(_currNbp, { emitEvent: false });
            return this.currService.getCurrencyNbp$(_currNbp);
          } else {
            return empty();
          }
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((_currNbp: ICurrencyNbp) => {
        this.currencyNbp.setValue(_currNbp, { emitEvent: false });
        this.prepExtraInfoTaxExchangedNbp(_currNbp);
      });

    this.currency.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((_curr: ICurrency) => {
        if (_curr.name == "PLN") {
          this.extraInfoIsTaxNbpExchanged.setValue(false, { emitEvent: false });
          let currNbpCurrency = this.currencyNbp.get("currency");
          (<FormControl>currNbpCurrency).setValue(_curr, {
            emitEvent: this.extraInfoIsTaxNbpExchanged.value,
          });
        }
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
  }

  public initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
    });
  }

  public initData(): void {
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
          this.toastService.toastMake(`Pobrano dane : ${s.invoiceNo}`, "init");
          this.rForm.markAsPristine();
        });
    } else {
      this.isFormReady = true;
      this.isPending = false;
      console.log("init Data, invoiceposADd");
      this.invoicePosAdd();
      this.rForm.markAsPristine();
    }
  }

  public navCancel(): void {
    throw new Error("Not implemented yet.");
  }

  public navDownload(): void {
    throw new Error("Not implemented yet.");
  }

  public navDelete(): void {
    const data = {
      title: "Faktura sprzedaży",
      question: `Czy na pewno usunąć dokument nr: ${this.rForm.value.invoiceNo} ? \n Dokumnet zostanie trwale usunięty z bazy bez możliwośći jego przywrcenia`,
    } as IDialogConfTakNieInfo;

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

  public navSave(): void {
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
    } as IDialogConfTakNieInfo;

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
    } as IDialogConfTakNieInfo;

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
                date: this.momentService.getToday(),
                info: "auto print faktury",
              } as IInvoiceExtraInfoChecked);
            }

            this.extraInfoCheckedSent.patchValue({
              checked: true,
              date: this.momentService.getToday(),
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

  prepExtraInfoTaxExchangedNbp(_currNbp: ICurrencyNbp): void {
    const netto = this.totalNetto.value;
    const nettoPLN = this.icf.roundToCurrency(netto * _currNbp.rate);
    const brutto = this.totalBrutto.value;
    const bruttoPLN = this.icf.roundToCurrency(brutto * _currNbp.rate);

    let info = `Średni kurs dla ${
      _currNbp.currency.name
    } z dnia ${this.momentService.getFormatedDate(_currNbp.rateDate)} (${
      _currNbp.rate
    }) ||| Netto (${netto}) wartość: ${nettoPLN} PLN ||| Podatek VAT (${this.icf.roundToCurrency(
      _currNbp.price
    )}) wartość: ${this.icf.roundToCurrency(
      _currNbp.plnValue
    )} PLN ||| Brutto (${brutto}) wartość: ${bruttoPLN} PLN `;
    this.extraInfoTaxExchangedInfo.setValue(info);
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
    this.prepExtraInfoTaxExchangedNbp(this.currencyNbp.value);
  }

  //#endregion

  //#region geters

  get baseInvoiceId(): FormControl {
    return <FormControl>this.rForm.get("baseInvoiceId");
  }

  get companyBuyer(): FormGroup {
    return <FormGroup>this.rForm.get("companyBuyer");
  }

  get companySeller(): FormGroup {
    return <FormGroup>this.rForm.get("companySeller");
  }

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get("creationInfo");
  }

  get correctionId(): FormControl {
    return <FormControl>this.rForm.get("correctionId");
  }

  get correctionTotalInfoFc(): FormControl {
    return <FormControl>this.rForm.get("correctionTotalInfo");
  }

  get currency(): FormControl {
    return <FormControl>this.rForm.get("currency");
  }

  get currencyNbp(): FormGroup {
    return <FormGroup>this.rForm.get("extraInfo.currencyNbp");
  }

  get extraInfo(): FormGroup {
    return <FormGroup>this.rForm.get("extraInfo");
  }

  get extraInfoCheckedCmr(): FormGroup {
    return <FormGroup>this.rForm.get("extraInfo.cmr");
  }

  get extraInfoCheckedRecived(): FormGroup {
    return <FormGroup>this.rForm.get("extraInfo.recived");
  }

  get extraInfoCheckedSent(): FormGroup {
    return <FormGroup>this.rForm.get("extraInfo.sent");
  }
  get extraInfoIsTaxNbpExchanged(): FormControl {
    return <FormControl>this.rForm.get("extraInfo.is_tax_nbp_exchanged");
  }
  get extraInfoTaxExchangedInfo(): FormControl {
    return <FormControl>this.rForm.get("extraInfo.tax_exchanged_info");
  }

  get extraInfoTtotalBruttoInWords(): FormControl {
    return <FormControl>this.rForm.get("extraInfo.total_brutto_in_words");
  }

  get getCorrectionPaymenntInfo(): FormControl {
    return <FormControl>this.rForm.get("getCorrectionPaymenntInfo");
  }

  get getInvoiceValue(): FormControl {
    return <FormControl>this.rForm.get("getInvoiceValue");
  }

  get info(): FormControl {
    return <FormControl>this.rForm.get("info");
  }

  get invoiceSellId(): FormControl {
    return <FormControl>this.rForm.get("invoiceSellId");
  }

  get invoiceNo(): FormControl {
    return <FormControl>this.rForm.get("invoiceNo");
  }

  get invoiceOriginalNo(): FormControl {
    return <FormControl>this.rForm.get("invoiceOriginalNo");
  }
  get invoiceOriginalPaid(): FormControl {
    return <FormControl>this.rForm.get("invoiceOriginalPaid");
  }

  get isCorrection(): FormControl {
    return <FormControl>this.rForm.get("isCorrection");
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
    return <FormGroup>this.rForm.get("invoiceLines.corrections");
  }

  get invoiceCurrentLines(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceLines.current");
  }

  get invoiceOriginalLines(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceLines.original");
  }

  get paymentDate(): FormControl {
    return <FormControl>this.rForm.get("paymentDate");
  }

  get paymentIsDone(): FormControl {
    return <FormControl>this.rForm.get("paymentIsDone");
  }

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get("paymentTerms");
  }

  get paymentIsTermsPaymentDays(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.paymentDays");
  }

  get invoiceTotal(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal");
  }

  get invoiceTotalCorrections(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal.corrections");
  }

  get invoiceTotalCurrent(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal.current");
  }

  get invoiceTotalOriginal(): FormGroup {
    return <FormGroup>this.rForm.get("invoiceTotal.original");
  }

  get rates(): FormArray {
    return <FormArray>this.rForm.get("rates");
  }

  get sellingDate(): FormControl {
    return <FormControl>this.rForm.get("dateOfSell");
  }

  get totalBrutto(): FormControl {
    return <FormControl>this.rForm.get("invoiceTotal.current.total_brutto");
  }

  get totalNetto(): FormControl {
    return <FormControl>this.rForm.get("invoiceTotal.current.total_netto");
  }

  get totalTax(): FormControl {
    return <FormControl>this.rForm.get("invoiceTotal.current.total_tax");
  }

  //#endregion
}
