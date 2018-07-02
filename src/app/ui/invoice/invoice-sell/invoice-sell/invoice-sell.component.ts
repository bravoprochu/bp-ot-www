import { InvoiceSellService } from '../services/invoice-sell.service';
import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IDetailObj } from '../../../../shared/idetail-obj';
import { INavDetailInfo } from '../../../../shared/interfaces/inav-detail-info';
import { DialogTakNieComponent } from '../../../../shared/dialog-tak-nie/dialog-tak-nie.component';
import { IDialogTakNieInfo } from '../../../../shared/interfaces/idialog-tak-nie-info';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { IBasicActions } from 'app/shared/ibasic-actions';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms/src/model';
import { saveAs } from "file-saver"
import { Subject, of, empty } from 'rxjs';
import { InvoiceCommonFunctionsService } from '../../common/invoice-common-functions.service'
import { CurrencyCommonService } from '@bpShared/currency/currency-common.service';
import { ICurrencyNbp } from '@bpShared/currency/interfaces/i-currency-nbp';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { IInvoiceSell } from '../../interfaces/iinvoice-sell';
import { map, takeUntil, debounceTime, switchMap, delay, take, tap } from 'rxjs/operators';
import { ICurrency } from '@bpShared/currency/interfaces/i-currency';



@Component({

  selector: 'app-invoice-sell',
  templateUrl: './invoice-sell.component.html',
  styleUrls: ['./invoice-sell.component.css']
})
export class InvoiceSellComponent implements OnInit, OnDestroy, IDetailObj {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private df: InvoiceSellService,
    private currService: CurrencyCommonService,
    private momentService: MomentCommonService,
    private dialogTakNie: MatDialog,
    private cf: CommonFunctionsService,
    private icf: InvoiceCommonFunctionsService,
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.isPending = true;
    //this.extraInfoNbp = this.currService.getCurrencyNbpGroup(this.fb, this.isDestroyed$, 'pln')
    this.initForm();
    this.initRouteId();
    //this.initData();
  }


  //#region geters

  get baseInvoiceId(): FormControl {
    return <FormControl>this.rForm.get('baseInvoiceId');
  }

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get('creationInfo');
  }

  get correctionId(): FormControl {
    return <FormControl>this.rForm.get('correctionId');
  }

  get correctionTotalInfoFc(): FormControl {
    return <FormControl>this.rForm.get('correctionTotalInfo');
  }

  get currency(): FormControl {
    return <FormControl>this.rForm.get('currency');
  }

  get currencyNbp(): FormGroup {
    return <FormGroup>this.rForm.get('extraInfo.currencyNbp');
  }

  get extraInfo(): FormGroup {
    return <FormGroup>this.rForm.get('extraInfo');
  }

  get extraInfoCheckedCmr(): FormGroup {
    return <FormGroup>this.rForm.get('extraInfo.cmr');
  }

  get extraInfoCheckedRecived(): FormGroup {
    return <FormGroup>this.rForm.get('extraInfo.recived');
  }

  get extraInfoCheckedSent(): FormGroup {
    return <FormGroup>this.rForm.get('extraInfo.sent');
  }
  get extraInfoIsTaxNbpExchanged(): FormControl {
    return <FormControl>this.rForm.get('extraInfo.is_tax_nbp_exchanged');
  }
  get extraInfoTaxExchangedInfo(): FormControl {
    return <FormControl>this.rForm.get('extraInfo.tax_exchanged_info');
  }

  get extraInfoTtotalBruttoInWords(): FormControl {
    return <FormControl>this.rForm.get('extraInfo.total_brutto_in_words');
  }

  get getCorrectionPaymenntInfo(): FormControl {
    return <FormControl>this.rForm.get('getCorrectionPaymenntInfo')
  }

  get getInvoiceValue(): FormControl {
    return <FormControl>this.rForm.get('getInvoiceValue')
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
    return <FormControl>this.rForm.get('isCorrection');
  }

  get isLoad(): boolean {
    return this.rForm.get('extraInfo.is_load_no').value
  }

  get isTransportOffer(): boolean {
    return this.rForm.get('extraInfo.transportOfferId').value
  }


  get invoiceLines(): FormArray {
    return <FormArray>this.rForm.get('invoiceLines');
  }

  get invoiceCorrectionsLines(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceLines.corrections');
  }

  get invoiceCurrentLines(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceLines.current');
  }

  get invoiceOriginalLines(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceLines.original');
  }


  get paymentDate(): FormControl {
    return <FormControl>this.rForm.get("paymentDate");
  }

  get paymentIsDone(): FormControl {
    return <FormControl>this.rForm.get("paymentIsDone");
  }

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get('paymentTerms');
  }

  get paymentIsTermsPaymentDays(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.paymentDays");
  }


  get invoiceTotal(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal');
  }

  get invoiceTotalCorrections(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal.corrections');
  }

  get invoiceTotalCurrent(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal.current');
  }

  get invoiceTotalOriginal(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal.original');
  }



  get rates(): FormArray {
    return <FormArray>this.rForm.get('rates');
  }


  get sellingDate(): FormControl {
    return <FormControl>this.rForm.get('dateOfSell');
  }

  get companySeller(): FormGroup {
    return <FormGroup>this.rForm.get('companySeller');
  }




  get totalBrutto(): FormControl {
    return <FormControl>this.rForm.get('invoiceTotal.current.total_brutto');
  }

  get totalTax(): FormControl {
    return <FormControl>this.rForm.get('invoiceTotal.current.total_tax');
  }

  //#endregion


  public navDetailInfo: INavDetailInfo = <INavDetailInfo>
    {
      title: {
        subtitle: "Tworzenie, edycja, szczegóły",
        title: "Faktura sprzedaży"
      },
      basicActions: {

      }
    }


  isDestroyed$: Subject<boolean>;
  correctionTotalInfoValueStyle: string;
  public dataObj: any;
  extraInfoNbp: FormGroup;
  isPending: boolean;


  public navActions: IBasicActions;
  public rForm: FormGroup;
  public routeId: number;

  //#region  init, start

  public initForm(): void {
    this.rForm = this.icf.formInvoiceSellGroup(this.fb, this.isDestroyed$);

    this.invoiceLines
      .valueChanges.pipe(
        takeUntil(this.isDestroyed$),
        debounceTime(2000),
        switchMap(sw => {
          console.log('switchMap', sw)
        if (this.invoiceLines.valid) {
          return this.df.calcRates(this.rForm.value).pipe(
            takeUntil(this.isDestroyed$)
          )
        } else {
          return Observable.empty();
        }
      }),
      map((s: any) => {
        if (s == "error") {
        } else {
          let data = <IInvoiceSell>s;
          this.icf.patchInvoiceRates(data.rates, this.rates, this.fb);
          this.icf.patchInvoiceTotal(data.invoiceTotal, this.invoiceTotal, this.fb);
          //this.cf.patchInvoiceLines(data.invoiceLines, this.invoiceLines, this.fb);
          this.getCorrectionPaymenntInfo.setValue(data.getCorrectionPaymenntInfo, { emitEvent: false });
          this.getInvoiceValue.setValue(data.getInvoiceValue, { emitEvent: false });
          this.icf.getInvoiceLinesCorrections(data.invoiceLines, this.invoiceLines);
        }
      })
    )
     .subscribe(
      );

    this.paymentIsDone
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        if (s) {
          this.paymentDate.setValidators(Validators.required);
        } else {
          this.paymentDate.clearValidators();
        }
        this.paymentDate.updateValueAndValidity();
      });

    this.paymentIsTermsPaymentDays.setValue(9, { emitEvent: false });

    this.sellingDate
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.paymentTerms.get('day0').patchValue(s, { emitEvent: true });
      });


    this.extraInfoIsTaxNbpExchanged.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      tap(() => this.currencyNbp.disable({ emitEvent: false })),
      switchMap((_isChecked: boolean) => {
        let _currNbp = <ICurrencyNbp>{
          currency: <ICurrency>this.currency.value,
          price: this.cf.roundToCurrency(this.totalTax.value),
          rateDate: this.sellingDate.value
        }

        if (_isChecked && (<ICurrencyNbp>this.currencyNbp.value).rate == 0) {
          //this.currencyNbp.patchValue(_currNbp, { emitEvent: true });
          console.log('check i rate: ', this.currencyNbp.value);
          return this.currService.getCurrencyNbp$(_currNbp)
        } else {
          this.currencyNbp.enable({ emitEvent: false });
          console.log('extraInfoIsTaxNbpExchanged !checked');
          return empty();
        }
      })
    )
      .subscribe(
        (_currNbp: ICurrencyNbp) => {
          this.currencyNbp.enable({ emitEvent: false });
          this.currencyNbp.setValue(_currNbp, { emitEvent: false });
          let info = `Średni kurs z dnia ${this.momentService.getFormatedDate(_currNbp.rateDate)} (${_currNbp.rate}), Podatek VAT (${this.cf.roundToCurrency(this.totalTax.value)}) wartość: ${this.cf.roundToCurrency(this.totalTax.value * _currNbp.rate)} PLN`;

          this.extraInfoTaxExchangedInfo.setValue(info)
        },
    );


    this.currency.valueChanges.pipe(
      takeUntil(this.isDestroyed$)
    )
      .subscribe(
        (_curr: ICurrency) => {
          if (_curr.name == "PLN") {
            this.extraInfoIsTaxNbpExchanged.setValue(false, { emitEvent: false });
              let currNbpCurrency = this.currencyNbp.get('currency');
              (<FormControl>currNbpCurrency).setValue(_curr, { emitEvent: this.extraInfoIsTaxNbpExchanged.value });
          }
        },
      )


    this.currencyNbp.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
    )
      .subscribe(
        (_currNbp: ICurrencyNbp) => {
          let info = `Średni kurs z dnia ${this.momentService.getFormatedDate(_currNbp.rateDate)} (${_currNbp.rate}), Podatek VAT (${this.cf.roundToCurrency(this.totalTax.value)}) wartość: ${this.cf.roundToCurrency(this.totalTax.value * _currNbp.rate)} PLN`;
          this.extraInfoTaxExchangedInfo.setValue(info)
        },
    );


    //total brutto in words - checkbox change
    this.extraInfo.get('is_in_words')
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.extraInfoTtotalBruttoInWords.patchValue(this.prepTotalInWord());
      });

    this.invoiceTotalCurrent
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .debounceTime(500)
      .subscribe(s => {
        this.extraInfoTtotalBruttoInWords.setValue(this.prepTotalInWord());
      })

  }

  public initRouteId(): void {
    this.actRoute.paramMap
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.routeId = +s.get('id');
        this.initData();
      });

  }

  public initData(): void {
    if (this.routeId > 0) {
      this.df.getById(this.routeId)
        .takeUntil(this.isDestroyed$)
        .subscribe((s: IInvoiceSell) => {
          this.navDetailInfo.basicActions.canDelete = true;
          this.icf.patchInvoiceSell(s, this.rForm, this.fb);
          this.isPending = false;
          this.cf.toastMake(`Pobrano dane : ${s.invoiceNo}`, "init", this.actRoute);
        })
    } else {
      this.isPending = false;
    }
  }

  public navCancel(): void {
    throw new Error('Not implemented yet.');
  }

  public navDownload(): void {
    throw new Error('Not implemented yet.');
  }

  public navDelete(): void {
    this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: "Faktura sprzedaży", question: `Czy na pewno usunąć dokument nr: ${this.rForm.value.invoiceNo} ? \n Dokumnet zostanie trwale usunięty z bazy bez możliwośći jego przywrcenia` } })
      .afterClosed()
      .switchMap(dialogResponse => {
        this.cf.toastMake("Usuwam dane", 'navDelete', this.actRoute);
        return dialogResponse ? this.df.delete(this.rForm.value.invoiceSellId) : Observable.empty()
      })
      .take(1)
      .subscribe(s => {
        this.cf.toastMake("Usunięto dane", "init", this.actRoute);
        this.router.navigate(['/fakturaSprzedazy'])
      })
  }

  public navSave(): void {
    //this.isPending = true;
    let id = this.invoiceSellId.value;

    if (!this.isCorrection.value) {
      //setting corrections, original brutto_value, vat_value etc to 0..
      this.prepZeroValuesLinesForNonCorrectionInvoice();
    }
    this.df.update(id, this.rForm.value)
      .take(1)
      .subscribe(s => {
        this.cf.toastMake("Zaktualizowano dane", "navSave", this.actRoute);
        this.icf.patchInvoiceSell(s, this.rForm, this.fb);
        this.isPending = false;
        this.rForm.markAsPristine();
      });
  }

  //#endregion

  //#region Invoice

  invoicePosAdd() {
    this.icf.lineAdd(this.invoiceLines, this.fb);
  }
  invoicePosRemove(idx: number) {
    this.icf.lineRemove(idx, this.rForm, this.invoiceLines, this.isDestroyed$);
  }


  invoiceClone() {
    return this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: 'Faktura sprzedaży klonik', question: 'Czy skopiować dane do nowotworzonej faktury ?' } })
      .afterClosed()
      .subscribe(s => {
        if (s) {
          this.invoiceSellId.setValue(0);
          this.invoiceNo.setValue("clone - nowa");
          this.creationInfo.reset();
          this.rForm.markAsDirty();
        }
      })
  }

  printInvoice() {
    this.isPending = true;
    this.df.printInvoice(this.rForm.value)
      .map(res => {
        return new Blob([res, 'application/pdf'], { type: 'application/pdf' });
      })
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        saveAs(s, `Faktura.pdf`);
        this.isPending = false;
        this.cf.toastMake("Faktura została wygenerowana", "printInvoice", this.actRoute);
      })
  }



  getCurrencyNbpExchange(): ICurrencyNbp {
    return <ICurrencyNbp>{
      currency: this.currency.value,
      rateDate: this.sellingDate.value,
      price: this.cf.roundToCurrency(this.invoiceTotalCurrent.get('total_tax').value)
    }
  }


  prepTaxExchangedInfo() {
    this.extraInfoNbp.patchValue(this.getCurrencyNbpExchange(), { emitEvent: true });
  }

  prepTotalInWord(): string {
    let totalBrutto: number = 0;
    if (this.isCorrection.value) {
      //this.correctionTotalInfoUpdate();
      totalBrutto = this.getInvoiceValue.value;
    } else {
      totalBrutto = this.totalBrutto.value
    }
    let inStr = (this.cf.roundToCurrency(totalBrutto)).toString();
    inStr.indexOf(',');
    let commaIdx = inStr.indexOf('.');
    let rest: string = "00";
    if (commaIdx > 0) {
      if (inStr.length - commaIdx == 2) {
        rest = `${inStr.slice(commaIdx + 1, inStr.length)}0`;
      } else {
        rest = inStr.slice(commaIdx + 1, inStr.length);
      }

    }
    return `${this.cf.inWords(totalBrutto)} ${rest}/100 ${this.currency.value.name}`
  }



  prepCorrectionOriginalData() {
    this.invoiceLines.controls.forEach(g => {
      let original = g.get('original');
      let current = g.get('current');
      let corr = g.get('corrections');

      //corr.patchValue(this.icf.getIInvoiceLine("none"), { emitEvent: false });
      current.get('baseInvoiceLineId').setValue(current.get('invoice_pos_id').value, { emitEvent: false });
      current.get('isCorrected').setValue(false, { emitEvent: false });
      //original.reset({}, {emitEvent: false});
      original.setValue(current.value, { emitEvent: false });
      //corr.reset(null, {emitEvent: false});
    });
  }

  prepZeroValuesLinesForNonCorrectionInvoice() {
    //this.getIInvoiceLine("none");

    this.invoiceLines.controls.forEach(line => {
      line.get('corrections').patchValue(this.icf.getIInvoiceLine("none"), { emitEvent: false });
      line.get('original').patchValue(this.icf.getIInvoiceLine("none"), { emitEvent: false });
    });
  }



  createCorrection() {
    this.prepCorrectionOriginalData();
    //this.router.navigate(['fakturaSprzedazyKorekta',0], {queryParams:  {invoiceSellId: this.invoiceSellId.value }});
    this.correctionTotalInfoFc.setValue(null);
    this.invoiceNo.setValue(null);
    this.invoiceOriginalPaid.setValue(this.paymentIsDone.value, { emitEvent: false });
    this.isCorrection.setValue(true);

  }


  //#endregion



}
