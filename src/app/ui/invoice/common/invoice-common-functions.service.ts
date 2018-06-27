import { Injectable } from '@angular/core';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogTakNieComponent } from '../../../shared/dialog-tak-nie/dialog-tak-nie.component';
import { IDialogTakNieInfo } from '../../../shared/interfaces/idialog-tak-nie-info';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { IInvoicePos } from '../interfaces/iinvoice-pos';
import { IInvoiceBuy } from '../interfaces/iinvoice-buy';
import { IInvoiceLineGroup, IInvoiceExtraInfo, IInvoiceSell, IInvoiceExtraInfoChecked, IInvoiceRateGroup, IInvoiceTotalGroup } from '../interfaces/iinvoice-sell';
import { IInvoiceRate } from '../interfaces/iinvoice-rate';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { ICreationInfo } from '@bpCommonInterfaces/i-creation-info';
import { PaymentTermsService } from '@bpShared/payment-terms/payment-terms.service';
import { CurrencyCommonService } from '@bpShared/currency/currency-common.service';

@Injectable()
export class InvoiceCommonFunctionsService {

  constructor(
    private cf: CommonFunctionsService,
    private dialogTakNie: MatDialog,
    private momentService: MomentCommonService,
    private pTermsService: PaymentTermsService,
    private currService: CurrencyCommonService,
  ) { }



  formInvoiceBuyGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let res = fb.group({
      "invoiceBuyId": [0],
      "companySeller": this.cf.formCompanyGroup(fb),
      "creationInfo": this.cf.formCreationInfo(fb),
      "currency": this.currService.getCurrencyListGroup(fb, isDestroyed$),
      "dateOfIssue": [this.momentService.getTodayConstTimeMoment(), Validators.required],
      "dateOfSell": [this.momentService.getTodayConstTimeMoment(), Validators.required],
      "info": [null],
      "invoiceNo": [null, Validators.required],
      "invoiceLines": fb.array([]),
      "invoiceTotal": fb.group({
        "original": this.formInvoiceTotal(fb),
        "current": this.formInvoiceTotal(fb),
        "corrections": this.formInvoiceTotal(fb),
      }),
      "isInvoiceReceived": [true],
      "isCorrection": [false],
      "invoiceReceivedDate": [this.momentService.getToday()],
      "loadId": [null],
      "loadNo": [null],
      "paymentIsDone": [false],
      "paymentDate": [this.momentService.getToday()],
      "paymentTerms": this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
      "rates": fb.array([]),
    });

    return res;
  }

  formInvoiceSellGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let res = fb.group({
      "invoiceSellId": [0],
      "baseInvoiceId": [0],
      "companyBuyer": this.cf.formCompanyGroup(fb),
      // "companySeller": this.cf.formCompanyGroup(fb),
      "correctionId": [null],
      "currency": this.currService.getCurrencyListGroup(fb, isDestroyed$),
      "dateOfIssue": [this.momentService.getTodayConstTimeMoment(), Validators.required],
      "dateOfSell": [this.momentService.getTodayConstTimeMoment(), Validators.required],
      "extraInfo": this.formInvoiceSellExtraInfoGroup(fb),
      "creationInfo": this.cf.formCreationInfo(fb),
      "getCorrectionPaymenntInfo": [null],
      "getInvoiceValue": [null],
      "correctionTotalInfo": [null],
      "info": [null],
      "isCorrection": [false],
      "invoiceNo": [null],
      "invoiceOriginalNo": [],
      "invoiceOriginalPaid": [false],
      "invoiceLines": fb.array([]),
      "invoiceTotal": fb.group({
        "original": this.formInvoiceTotal(fb),
        "current": this.formInvoiceTotal(fb),
        "corrections": this.formInvoiceTotal(fb),
      }),
      "paymentIsDone": [false],
      "paymentDate": [null],
      "paymentTerms": this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
      // "rates": fb.array([]),
      rates: fb.array([])


    });


    res.get('dateOfSell').valueChanges
      .takeUntil(isDestroyed$)
      .subscribe(s => {
        res.get('paymentTerms.day0').patchValue(s, { emitEvent: false });
      })
    return res;
  }

  formInvoiceRatesValuesGroup(fb: FormBuilder) {
    return fb.group({
      "rate_value_id": [0],
      "brutto_value": [null],
      "netto_value": [null],
      "vat_rate": [null],
      "vat_value": [null]
    });
  }

  formInvoiceRateGroupGroup(fb: FormBuilder) {
    return fb.group({
      "vatRate": [null],
      "original": this.formInvoiceRatesValuesGroup(fb),
      "current": this.formInvoiceRatesValuesGroup(fb),
      "corrections": this.formInvoiceRatesValuesGroup(fb)
    });
  }

  formInvoiceSellExtraInfoGroup(fb: FormBuilder) {
    return fb.group({
      'cmr': this.cf.formExtraInfoCheckedGroup(fb),
      'recived': this.cf.formExtraInfoCheckedGroup(fb),
      'sent': this.cf.formExtraInfoCheckedGroup(fb),
      'invoiceBuyId': [],
      'invoiceBuyNo': [],
      'invoiceSellId': [],
      'invoiceSellNo': [],
      "is_load_no": [false],
      "is_in_words": [false],
      "is_tax_nbp_exchanged": [false],
      "isSigningPlace": [false],
      "loadId": [null],
      "loadNo": [null],
      "tax_exchanged_info": [null],
      "total_brutto_in_words": [null],
      "transportOfferId": [null],
      "transportOfferNo": [null]
    })
  }

  formInvoiceLineGroup(fb: FormBuilder) {
    return fb.group({
      "invoice_pos_id": [0],
      "baseInvoiceLineId": [0],
      "brutto_value": [null],
      "isCorrected": [false],
      "correctionInfo": [null],
      "name": [null, Validators.required],
      "measurement_unit": ["szt.", Validators.required],
      "netto_value": [null],
      "pkwiu": [null],
      "quantity": [1],
      "unit_price": [null, Validators.required],
      "vat_unit_value": [null],
      "vat_value": [null],
      "vat_rate": [null, Validators.required],
    });
  }


  formInvoiceLineNoValidationGroup(fb: FormBuilder) {
    return fb.group({
      "invoice_pos_id": [0],
      "baseInvoiceLineId": [null],
      "brutto_value": [null],
      "isCorrected": [false],
      "correctionInfo": [null],
      "name": [null],
      "measurement_unit": ["szt."],
      "netto_value": [null],
      "pkwiu": [null],
      "quantity": [1],
      "unit_price": [0],
      "vat_unit_value": [null],
      "vat_value": [null],
      "vat_rate": [null],
    });
  }

  formInvoiceLineGroupGroup(fb: FormBuilder) {
    return fb.group({
      "corrections": this.formInvoiceLineNoValidationGroup(fb),
      "current": this.formInvoiceLineGroup(fb),
      "original": this.formInvoiceLineNoValidationGroup(fb)
    })
  }

  formInvoiceTotal(fb: FormBuilder) {
    return fb.group({
      "total_brutto": [0, Validators.required],
      "total_netto": [0, Validators.required],
      "total_tax": [0, Validators.required],
    });
  }


  getIInvoiceLine(vatRate: string) {
    return <IInvoicePos>{
      invoice_pos_id: 0,
      brutto_value: 0,
      netto_value: 0,
      quantity: 0,
      unit_price: 0,
      vat_rate: vatRate,
      vat_unit_value: 0,
      vat_value: 0,
    }
  }

  getInvoiceLinesCorrections(lines: IInvoiceLineGroup[], linesFA: FormArray) {
    linesFA.controls.forEach(lineG => {
      let corr = lineG.get('corrections');
      let curr = <IInvoicePos>lineG.get('current').value
      let foundLineGroup = lines.find(f => f.current.brutto_value == curr.brutto_value && f.current.name == curr.name && f.current.netto_value == curr.netto_value && f.current.vat_rate == curr.vat_rate);
      if (foundLineGroup) {
        corr.setValue(foundLineGroup.corrections, { emitEvent: false });
      }
    })
  }


  isRateInInvoicePos(rate: any, posArr: IInvoiceRate[]): number {
    let res: number = -1;
    let idx: number = 0;
    posArr.forEach(pos => {
      if (rate == pos.vat_rate) {
        res = idx;
      }
      idx++
    });
    return res;
  }

  lineAdd(invoiceLines: FormArray, fb: FormBuilder) {
    let newLineFg = this.formInvoiceLineGroupGroup(fb);
    newLineFg.get('original').patchValue(this.getIInvoiceLine(null));
    newLineFg.get('corrections').patchValue(this.getIInvoiceLine(null));

    invoiceLines.push(newLineFg);

  }


  lineRemove(idx: number, rForm: FormGroup, invoiceLines: FormArray, isDestroyed$: Subject<boolean>) {
    let d = this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: "Faktury", question: "Czy na pewno usunąć tą pozycję ?" } });
    d.afterClosed()
      .takeUntil(isDestroyed$)
      .subscribe((s: boolean) => {
        if (s === true) {
          invoiceLines.removeAt(idx);
          rForm.markAsDirty();
        }
      })
  }

  patchInvoiceBuy(inv: IInvoiceBuy, rForm: FormGroup, fb: FormBuilder) {
    //rForm.reset();
    this.cf.patchCompanyData(inv.companySeller, <FormGroup>rForm.get('companySeller'), fb);
    let invoicePosList = (<FormArray>rForm.get('invoiceLines'));
    let ratesValueList = (<FormArray>rForm.get('rates'));
    let creationInfo = <FormGroup>rForm.get('creationInfo');
    let paymentTerms = <FormGroup>rForm.get('paymentTerms');

    this.cf.patchCreationInfo(<ICreationInfo>inv, creationInfo);

    inv.invoiceReceivedDate = this.momentService.convertToConstTime(inv.invoiceReceivedDate);
    this.patchInvoiceLine(inv.invoiceLines, invoicePosList, fb);
    this.patchInvoiceRates(inv.rates, ratesValueList, fb);
    this.pTermsService.patchPaymentTerms(inv.paymentTerms, paymentTerms);

    inv.dateOfIssue = this.momentService.convertToConstTime(inv.dateOfIssue);
    inv.paymentDate = this.momentService.convertToConstTime(inv.paymentDate);
    inv.dateOfSell = this.momentService.convertToConstTime(inv.dateOfSell);
    rForm.patchValue(inv, { emitEvent: false });
  }

  patchInvoiceSell(inv: IInvoiceSell, rForm: FormGroup, fb: FormBuilder): void {

    this.cf.patchCompanyData(inv.companyBuyer, <FormGroup>rForm.get('companyBuyer'), fb);
    // this.cf.patchCompanyData(inv.companySeller, <FormGroup>rForm.get('companySeller'), fb);

    let creationInfo = <FormGroup>rForm.get('creationInfo');
    let currency = <FormGroup>rForm.get('currency');

    let invLines = <FormArray>rForm.get('invoiceLines');

    let invTotal = <FormGroup>rForm.get('invoiceTotal');

    let rates = <FormArray>rForm.get('rates');


    this.cf.patchCreationInfo(<ICreationInfo>inv, creationInfo);


    //invoiceLines
    this.patchInvoiceLine(inv.invoiceLines, <FormArray>invLines, fb);

    //rates
    this.patchInvoiceRates(inv.rates, rates, fb);

    this.patchInvoiceTotal(inv.invoiceTotal, invTotal, fb);
    inv.dateOfSell = this.momentService.convertToConstTime(inv.dateOfSell);
    inv.dateOfIssue = this.momentService.convertToConstTime(inv.dateOfIssue);

    let pTerms = <FormGroup>rForm.get('paymentTerms');
    this.pTermsService.patchPaymentTerms(inv.paymentTerms, pTerms);

    this.cf.patchInvoiceExtraInfo(inv.extraInfo, <FormGroup>rForm.get('extraInfo'));

    rForm.patchValue(inv, { emitEvent: false, onlySelf: true });
  }



  patchInvoiceLine(data: IInvoiceLineGroup[], rForm: FormArray, fb: FormBuilder) {
    if (data == undefined || data == null || data.length == 0) { return; }
    rForm.controls = [];
    data.forEach(group => {
      let invLineGroup = this.formInvoiceLineGroupGroup(fb);
      invLineGroup.get('corrections').patchValue(group.corrections, { emitEvent: false });
      invLineGroup.get('current').patchValue(group.current, { emitEvent: false });
      invLineGroup.get('original').patchValue(group.original, { emitEvent: false });
      //invLineGroup.patchValue(group, {emitEvent:false});
      rForm.push(invLineGroup);
    });
  }

  patchInvoiceRates(data: IInvoiceRateGroup[], rForm: FormArray, fb: FormBuilder): void {
    if (data == undefined || data == null || data.length == 0) { return; }
    rForm.controls = [];
    data.forEach(rate => {
      let rateGroup = this.formInvoiceRateGroupGroup(fb);
      rateGroup.patchValue(rate, { emitEvent: false });
      rForm.push(rateGroup);
    })
  }


  patchInvoiceTotal(data: IInvoiceTotalGroup, rForm: FormGroup, fb: FormBuilder): void {
    let invTotalCorrections = <FormGroup>rForm.get('corrections');
    let invTotalCurrent = <FormGroup>rForm.get('current');
    let invTotalOrginal = <FormGroup>rForm.get('original');
    //invoice total
    invTotalCorrections.patchValue(data.corrections, { emitEvent: false });
    invTotalCurrent.patchValue(data.current, { emitEvent: false });
    invTotalOrginal.patchValue(data.original, { emitEvent: false });
  }
}
