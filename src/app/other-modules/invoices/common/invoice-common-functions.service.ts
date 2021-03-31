import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IDialogConfTakNieInfo } from "../../../shared/interfaces/idialog-tak-nie-info";
import { Subject } from "rxjs";
import { IInvoicePos } from "../interfaces/iinvoice-pos";
import { IInvoiceBuy } from "../interfaces/iinvoice-buy";
import {
  IInvoiceLineGroup,
  IInvoiceSell,
  IInvoiceRateGroup,
  IInvoiceTotalGroup,
  IInvoiceExtraInfoChecked,
  IInvoiceExtraInfo,
} from "../interfaces/iinvoice-sell";
import { IInvoiceRate } from "../interfaces/iinvoice-rate";
import { ICreationInfo } from "@bpCommonInterfaces/i-creation-info";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import * as moment from "moment";
import { IDateRange } from "@bpCommonInterfaces/i-date-range";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { takeUntil } from "rxjs/operators";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";

@Injectable()
export class InvoiceCommonFunctionsService {
  constructor(
    private dialogConfirmationService: DialogConfirmationsService,
    private momentService: MomentCommonService,
    private pTermsService: PaymentTermsService,
    private currService: CurrencyCommonService,
    private contractorService: ContractorService
  ) {}

  dateTimeLocaleFormat(): string {
    return "YYYY-MM-DDTHH:mm";
  }

  csvConverter(data: any[], tableHeaders: string[]): string {
    if (Array.isArray(data) && data.length > 1) {
      let firstLine: string = "";
      let end = ";";
      let lineEnd = "\r\n";
      let result: string = "";

      //
      // header
      //

      firstLine = tableHeaders.join(end) + lineEnd;

      //
      // loop
      //

      data.forEach((row) => {
        tableHeaders.forEach((header) => {
          let v: string;
          if (row[header] == null) {
            v = "";
          } else {
            v = row[header];
          }
          result += v + end;
        });
        result += lineEnd;
      });

      return firstLine + result;
    }
    return;
  }

  dateLocaleFormat(): string {
    return "YYYY-MM-DD";
  }

  dateRangeActiveMonth(): IDateRange {
    return <IDateRange>{
      dateStart: moment().date(1),
      dateEnd: moment(),
    };
  }

  dateRangeLastQuarter(): IDateRange {
    return <IDateRange>{
      dateStart: moment().subtract(3, "month").date(1),
      dateEnd: moment(),
    };
  }

  formCreationInfo(fb: FormBuilder) {
    return fb.group({
      createdBy: [null],
      createdDateTime: [null],
      modifyBy: [null],
      modifyDateTime: [null],
    });
  }

  formExtraInfoCheckedGroup(fb: FormBuilder) {
    return fb.group({
      invoiceExtraInfoCheckedId: [],
      checked: [false],
      date: [this.momentService.getTodayConstTimeMoment()],
      info: [],
    });
  }

  formInvoiceBuyGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let res = fb.group({
      invoiceBuyId: [0],
      companySeller: this.contractorService.formCompanyGroup(fb),
      creationInfo: this.formCreationInfo(fb),
      currency: this.currService.getCurrencyListGroup(fb, isDestroyed$),
      dateOfIssue: [
        this.momentService.getTodayConstTimeMoment(),
        Validators.required,
      ],
      dateOfSell: [
        this.momentService.getTodayConstTimeMoment(),
        Validators.required,
      ],
      info: [null],
      invoiceNo: [null, Validators.required],
      invoiceLines: fb.array([]),
      invoiceTotal: fb.group({
        original: this.formInvoiceTotal(fb),
        current: this.formInvoiceTotal(fb),
        corrections: this.formInvoiceTotal(fb),
      }),
      isInvoiceReceived: [true],
      isCorrection: [false],
      invoiceReceivedDate: [this.momentService.getToday()],
      loadId: [null],
      loadNo: [null],
      paymentIsDone: [false],
      paymentDate: [this.momentService.getToday()],
      paymentTerms: this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
      rates: fb.array([]),
    });

    return res;
  }

  formInvoiceSellGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>) {
    let res = fb.group({
      invoiceSellId: [0],
      baseInvoiceId: [0],
      companyBuyer: this.contractorService.formCompanyGroup(fb),
      correctionId: [null],
      currency: this.currService.getCurrencyListGroup(fb, isDestroyed$),
      dateOfIssue: [
        this.momentService.getTodayConstTimeMoment(),
        Validators.required,
      ],
      dateOfSell: [
        this.momentService.getTodayConstTimeMoment(),
        Validators.required,
      ],
      creationInfo: this.formCreationInfo(fb),
      extraInfo: this.formInvoiceSellExtraInfoGroup(fb, isDestroyed$),
      getCorrectionPaymenntInfo: [null],
      getInvoiceValue: [null],
      correctionTotalInfo: [null],
      info: [null],
      isCorrection: [false],
      invoiceNo: [null],
      invoiceOriginalNo: [],
      invoiceOriginalPaid: [false],
      invoiceLines: fb.array([]),
      invoiceTotal: fb.group({
        original: this.formInvoiceTotal(fb),
        current: this.formInvoiceTotal(fb),
        corrections: this.formInvoiceTotal(fb),
      }),
      paymentIsDone: [false],
      paymentDate: [null],
      paymentTerms: this.pTermsService.getPaymentTermsGroup(fb, isDestroyed$),
      rates: fb.array([]),
    });

    res
      .get("dateOfSell")
      .valueChanges.pipe(takeUntil(isDestroyed$))
      .subscribe((s) => {
        res.get("paymentTerms.day0").patchValue(s, { emitEvent: false });
      });
    return res;
  }

  formInvoiceRatesValuesGroup(fb: FormBuilder) {
    return fb.group({
      rate_value_id: [0],
      brutto_value: [null],
      netto_value: [null],
      vat_rate: [null],
      vat_value: [null],
    });
  }

  formInvoiceRateGroupGroup(fb: FormBuilder) {
    return fb.group({
      vatRate: [null],
      original: this.formInvoiceRatesValuesGroup(fb),
      current: this.formInvoiceRatesValuesGroup(fb),
      corrections: this.formInvoiceRatesValuesGroup(fb),
    });
  }

  formInvoiceSellExtraInfoGroup(
    fb: FormBuilder,
    isDestroyed$: Subject<boolean>
  ) {
    return fb.group({
      cmr: this.formExtraInfoCheckedGroup(fb),
      recived: this.formExtraInfoCheckedGroup(fb),
      sent: this.formExtraInfoCheckedGroup(fb),
      currencyNbp: this.currService.getCurrencyNbpGroup(fb, isDestroyed$),
      invoiceBuyId: [],
      invoiceBuyNo: [],
      invoiceSellId: [],
      invoiceSellNo: [],
      is_load_no: [false],
      is_in_words: [false],
      is_tax_nbp_exchanged: [false],
      isSigningPlace: [false],
      loadId: [null],
      loadNo: [null],
      tax_exchanged_info: [null],
      total_brutto_in_words: [null],
      transportOfferId: [null],
      transportOfferNo: [null],
    });
  }

  formInvoiceLineGroup(fb: FormBuilder) {
    return fb.group({
      invoice_pos_id: [0],
      baseInvoiceLineId: [0],
      brutto_value: [0],
      isCorrected: [false],
      correctionInfo: [null],
      name: [null, Validators.required],
      measurement_unit: ["szt.", Validators.required],
      netto_value: [0],
      pkwiu: [null],
      quantity: [1],
      unit_price: [null, Validators.required],
      vat_unit_value: [0],
      vat_value: [0],
      vat_rate: [null, Validators.required],
    });
  }

  formInvoiceLineNoValidationGroup(fb: FormBuilder) {
    return fb.group({
      invoice_pos_id: [0],
      baseInvoiceLineId: [null],
      brutto_value: [null],
      isCorrected: [false],
      correctionInfo: [null],
      name: [null],
      measurement_unit: ["szt."],
      netto_value: [null],
      pkwiu: [null],
      quantity: [1],
      unit_price: [0],
      vat_unit_value: [null],
      vat_value: [null],
      vat_rate: [null],
    });
  }

  formInvoiceLineGroupGroup(fb: FormBuilder) {
    return fb.group({
      corrections: this.formInvoiceLineNoValidationGroup(fb),
      current: this.formInvoiceLineGroup(fb),
      original: this.formInvoiceLineNoValidationGroup(fb),
    });
  }

  formInvoiceTotal(fb: FormBuilder) {
    return fb.group({
      total_brutto: [0, Validators.required],
      total_netto: [0, Validators.required],
      total_tax: [0, Validators.required],
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
    };
  }

  getInvoiceLinesCorrections(lines: IInvoiceLineGroup[], linesFA: FormArray) {
    linesFA.controls.forEach((lineG) => {
      let corr = lineG.get("corrections");
      let curr = <IInvoicePos>lineG.get("current").value;
      let foundLineGroup = lines.find(
        (f) =>
          f.current.brutto_value == curr.brutto_value &&
          f.current.name == curr.name &&
          f.current.netto_value == curr.netto_value &&
          f.current.vat_rate == curr.vat_rate
      );
      if (foundLineGroup) {
        corr.setValue(foundLineGroup.corrections, { emitEvent: false });
      }
    });
  }

  inWords(numberToConv: number): string {
    // przypisanie obiektu pola tekstowego do zmiennej

    // pobranie liczby
    var liczba = numberToConv;

    var jednosci = [
      "",
      " jeden",
      " dwa",
      " trzy",
      " cztery",
      " pięć",
      " sześć",
      " siedem",
      " osiem",
      " dziewięć",
    ];
    var nascie = [
      "",
      " jedenaście",
      " dwanaście",
      " trzynaście",
      " czternaście",
      " piętnaście",
      " szesnaście",
      " siedemnaście",
      " osiemnaście",
      " dziewietnaście",
    ];
    var dziesiatki = [
      "",
      " dziesięć",
      " dwadzieścia",
      " trzydzieści",
      " czterdzieści",
      " pięćdziesiąt",
      " sześćdziesiąt",
      " siedemdziesiąt",
      " osiemdziesiąt",
      " dziewięćdziesiąt",
    ];
    var setki = [
      "",
      " sto",
      " dwieście",
      " trzysta",
      " czterysta",
      " pięćset",
      " sześćset",
      " siedemset",
      " osiemset",
      " dziewięćset",
    ];
    var grupy = [
      ["", "", ""],
      [" tysiąc", " tysiące", " tysięcy"],
      [" milion", " miliony", " milionów"],
      [" miliard", " miliardy", " miliardów"],
      [" bilion", " biliony", " bilionów"],
      [" biliard", " biliardy", " biliardów"],
      [" trylion", " tryliony", " trylionów"],
    ];

    if (!isNaN(liczba)) {
      var wynik = "";
      var znak = "";
      if (liczba == 0) wynik = "zero";
      if (liczba < 0) {
        znak = "minus";
        liczba = liczba * -1;
      }

      var g = 0;
      while (liczba > 0) {
        var s = Math.floor((liczba % 1000) / 100);
        var n = 0;
        var d = Math.floor((liczba % 100) / 10);
        var j = Math.floor(liczba % 10);
        if (d == 1 && j > 0) {
          n = j;
          d = 0;
          j = 0;
        }

        var k = 2;
        if (j == 1 && s + d + n == 0) k = 0;
        if (j == 2 || j == 3 || j == 4) k = 1;
        if (s + d + n + j > 0)
          wynik =
            setki[s] +
            dziesiatki[d] +
            nascie[n] +
            jednosci[j] +
            grupy[g][k] +
            wynik;

        g++;
        liczba = Math.floor(liczba / 1000);
      }
    } else {
      return "Błędne dane";
    }
    return wynik;
  }

  isRateInInvoicePos(rate: any, posArr: IInvoiceRate[]): number {
    let res: number = -1;
    let idx: number = 0;
    posArr.forEach((pos) => {
      if (rate == pos.vat_rate) {
        res = idx;
      }
      idx++;
    });
    return res;
  }

  lineAdd(invoiceLines: FormArray, fb: FormBuilder) {
    let newLineFg = this.formInvoiceLineGroupGroup(fb);
    newLineFg.get("original").patchValue(this.getIInvoiceLine(null));
    newLineFg.get("corrections").patchValue(this.getIInvoiceLine(null));

    invoiceLines.push(newLineFg);
  }

  lineRemove(
    idx: number,
    rForm: FormGroup,
    invoiceLines: FormArray,
    isDestroyed$: Subject<boolean>
  ) {
    const data = {
      title: "Faktury",
      question: "Czy na pewno usunąć tą pozycję ?",
    } as IDialogConfTakNieInfo;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(takeUntil(isDestroyed$))
      .subscribe((s: boolean) => {
        if (s === true) {
          invoiceLines.removeAt(idx);
          rForm.markAsDirty();
        }
      });
  }

  paginatorLimitOption(length: number): number[] {
    let res: number[] = [];

    if (length > 5) {
      res.push(5);
    }
    if (length > 10) {
      res.push(10);
    }
    if (length > 25) {
      res.push(25);
    }
    if (length > 50) {
      res.push(50);
    }
    if (length > 100) {
      res.push(100);
    }
    if (res.length == 0 || (res.length > 0 && res[res.length - 1] != length)) {
      res.push(length);
    }
    return res;
  }

  paginatorPageSize(length: number): number {
    return length > 10 ? 10 : length;
  }

  patchCreationInfo(info: ICreationInfo, rForm: FormGroup) {
    info.createdDateTime = this.setFormatedDateTime(info.createdDateTime);
    info.modifyDateTime = this.setFormatedDateTime(info.modifyDateTime);
    rForm.patchValue(info, { emitEvent: false });
  }

  patchInvoiceBuy(inv: IInvoiceBuy, rForm: FormGroup, fb: FormBuilder) {
    //rForm.reset();
    this.contractorService.patchCompanyData(
      inv.companySeller,
      <FormGroup>rForm.get("companySeller"),
      fb
    );
    let invoicePosList = <FormArray>rForm.get("invoiceLines");
    let ratesValueList = <FormArray>rForm.get("rates");
    let creationInfo = <FormGroup>rForm.get("creationInfo");
    let paymentTerms = <FormGroup>rForm.get("paymentTerms");

    this.patchCreationInfo(<ICreationInfo>inv, creationInfo);

    inv.invoiceReceivedDate = this.momentService.convertToConstTime(
      inv.invoiceReceivedDate
    );
    this.patchInvoiceLines(inv.invoiceLines, invoicePosList, fb);
    this.patchInvoiceRates(inv.rates, ratesValueList, fb);
    this.pTermsService.patchPaymentTerms(inv.paymentTerms, paymentTerms);

    inv.dateOfIssue = this.momentService.convertToConstTime(inv.dateOfIssue);
    inv.paymentDate = this.momentService.convertToConstTime(inv.paymentDate);
    inv.dateOfSell = this.momentService.convertToConstTime(inv.dateOfSell);
    rForm.patchValue(inv, { emitEvent: false });
  }

  patchInvoiceSell(inv: IInvoiceSell, rForm: FormGroup, fb: FormBuilder): void {
    this.contractorService.patchCompanyData(
      inv.companyBuyer,
      <FormGroup>rForm.get("companyBuyer"),
      fb
    );

    let creationInfo = <FormGroup>rForm.get("creationInfo");
    let currency = <FormGroup>rForm.get("currency");
    let invLines = <FormArray>rForm.get("invoiceLines");
    let invTotal = <FormGroup>rForm.get("invoiceTotal");
    let rates = <FormArray>rForm.get("rates");

    this.patchCreationInfo(<ICreationInfo>inv, creationInfo);

    //invoiceLines
    this.patchInvoiceLines(inv.invoiceLines, <FormArray>invLines, fb);

    //rates
    this.patchInvoiceRates(inv.rates, rates, fb);

    this.patchInvoiceTotal(inv.invoiceTotal, invTotal, fb);
    inv.dateOfSell = this.momentService.convertToConstTime(inv.dateOfSell);
    inv.dateOfIssue = this.momentService.convertToConstTime(inv.dateOfIssue);

    let pTerms = <FormGroup>rForm.get("paymentTerms");
    this.pTermsService.patchPaymentTerms(inv.paymentTerms, pTerms);

    //default settings for currencyNbp
    if (!inv.extraInfo.currencyNbp.currency) {
      inv.extraInfo.currencyNbp.currency = this.currService.findCurrencyByName(
        "eur"
      );
      inv.extraInfo.currencyNbp.rateDate = this.momentService.getToday();
    }
    this.patchInvoiceExtraInfo(
      inv.extraInfo,
      <FormGroup>rForm.get("extraInfo")
    );
    rForm.patchValue(inv, { onlySelf: true, emitEvent: false });
  }

  patchInvoiceExtraInfo(info: IInvoiceExtraInfo, rForm: FormGroup) {
    this.patchInvoiceExtraInfoChecked(info.cmr, <FormGroup>rForm.get("cmr"));
    this.patchInvoiceExtraInfoChecked(
      info.recived,
      <FormGroup>rForm.get("recived")
    );
    this.patchInvoiceExtraInfoChecked(info.sent, <FormGroup>rForm.get("sent"));
    if (info.currencyNbp.currency) {
      this.currService.patchCurrencyNbp(
        info.currencyNbp,
        <FormGroup>rForm.get("currencyNbp")
      );
    }
    //rForm.patchValue(info, { emitEvent: false, onlySelf: true});
  }

  patchInvoiceLines(
    data: IInvoiceLineGroup[],
    rForm: FormArray,
    fb: FormBuilder
  ) {
    if (data == undefined || data == null || data.length == 0) {
      return;
    }
    rForm.controls = [];
    let c = [];
    data.forEach((group) => {
      let invLineGroup = this.formInvoiceLineGroupGroup(fb);
      rForm.push(invLineGroup);
    });
  }

  patchInvoiceLinesUpdate(data: IInvoiceLineGroup[], rForm: FormArray) {
    for (let i = 0; i < data.length; i++) {
      const idx = data[i];
      rForm.at(i).setValue(idx, { emitEvent: false });
    }
  }

  patchInvoiceExtraInfoChecked(
    info: IInvoiceExtraInfoChecked,
    rForm: FormGroup
  ) {
    if (info == null) {
      return;
    }
    info.date = this.momentService.convertToConstTime(info.date);
    rForm.patchValue(info, { emitEvent: false });
  }

  patchInvoiceRates(
    data: IInvoiceRateGroup[],
    rForm: FormArray,
    fb: FormBuilder
  ): void {
    if (data == undefined || data == null || data.length == 0) {
      return;
    }
    rForm.controls = [];
    data.forEach((rate) => {
      let rateGroup = this.formInvoiceRateGroupGroup(fb);
      rateGroup.patchValue(rate, { emitEvent: false });
      rForm.push(rateGroup);
    });
  }

  patchInvoiceTotal(
    data: IInvoiceTotalGroup,
    rForm: FormGroup,
    fb: FormBuilder
  ): void {
    let invTotalCorrections = <FormGroup>rForm.get("corrections");
    let invTotalCurrent = <FormGroup>rForm.get("current");
    let invTotalOrginal = <FormGroup>rForm.get("original");
    //invoice total
    invTotalCorrections.patchValue(data.corrections, { emitEvent: false });
    invTotalCurrent.patchValue(data.current, { emitEvent: false });
    invTotalOrginal.patchValue(data.original, { emitEvent: false });
  }

  roundToCurrency(v: number): number {
    if (isNaN(v) || v == 0) {
      return 0;
    }
    return Math.round(v * 100) / 100;
  }

  setFormatedDateTime(date: any): string {
    if (date == null || !moment(date).isValid) {
      return null;
    }
    return moment(date).utc(false).format(this.dateTimeLocaleFormat());
  }
}
