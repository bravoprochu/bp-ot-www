import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IInvoiceLine } from '../../../../shared/interfaces/iinvoice-pos';


@Component({
  selector: 'app-invoice-sell-pos',
  templateUrl: './invoice-pos.component.html',
  styleUrls: ['./invoice-pos.component.css']
})
export class InvoicePosComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isAlive = false;
  }
  @Input() rForm: FormGroup;
  @Input() isCorrection: FormControl;
  @Output() remove = new EventEmitter();

  constructor(private cf: CommonFunctionsService) { }

  //#region getters

  get correctionsGroup(): FormGroup {
    return <FormGroup>this.rForm.get('corrections');
  }

  get correctionsBruttoValue(): FormControl {
    return <FormControl>this.rForm.get('corrections.brutto_value');
  }

  get correctionsNettoValue(): FormControl {
    return <FormControl>this.rForm.get('corrections.netto_value');
  }
  get correctionsQuantity(): FormControl {
    return <FormControl>this.rForm.get('corrections.quantity');
  }
  get correctionsUnitPrice(): FormControl {
    return <FormControl>this.rForm.get('corrections.unit_price');
  }
  get correctionsVatUnitValue(): FormControl {
    return <FormControl>this.rForm.get('corrections.vat_unit_value');
  }

  get correctionsVatValue(): FormControl {
    return <FormControl>this.rForm.get('corrections.vat_value');
  }

  get correctionInfo(): FormControl {
    return <FormControl>this.rForm.get('current.correctionInfo');
  }



  get currentGroup(): FormGroup {
    return <FormGroup>this.rForm.get('current');
  }

  get currentBruttoValue(): FormControl {
    return <FormControl>this.rForm.get('current.brutto_value');
  }

  get currentIsCorrected(): FormControl {
    return <FormControl>this.rForm.get('current.isCorrected');
  }

  get currentNettoValue(): FormControl {
    return <FormControl>this.rForm.get('current.netto_value');
  }
  get currentQuantity(): FormControl {
    return <FormControl>this.rForm.get('current.quantity');
  }
  get currentUnitPrice(): FormControl {
    return <FormControl>this.rForm.get('current.unit_price');
  }
  get currentVatUnitValue(): FormControl {
    return <FormControl>this.rForm.get('current.vat_unit_value');
  }

  get currentVatValue(): FormControl {
    return <FormControl>this.rForm.get('current.vat_value');
  }





  get originalGroup(): FormGroup {
    return <FormGroup>this.rForm.get('original');
  }

  get originalBruttoValue(): FormControl {
    return <FormControl>this.rForm.get('original.brutto_value');
  }

  get originalNettoValue(): FormControl {
    return <FormControl>this.rForm.get('original.netto_value');
  }

  get originalQuantity(): FormControl {
    return <FormControl>this.rForm.get('original.quantity');
  }
  get originalUnitPrice(): FormControl {
    return <FormControl>this.rForm.get('original.unit_price');
  }
  get originalVatUnitValue(): FormControl {
    return <FormControl>this.rForm.get('original.vat_unit_value');
  }

  get originalVatValue(): FormControl {
    return <FormControl>this.rForm.get('original.vat_value');
  }





  // get bruttoValue() {
  //   return this.rForm.get('current.brutto_value');
  // }

  // get nettoValue() {
  //   return this.rForm.get('current.netto_value');
  // }
  // get vatValue() {
  //   return this.rForm.get('current.vat_value');
  // }
  // get vatUnitValue() {
  //   return this.rForm.get('current.vat_unit_value');
  // }
  // get vatRate() {
  //   return this.rForm.get('current.vat_rate');
  // }

  //#endregion


  ngOnInit() {
    //this.nettoValueUpdate(this.currentGroup.value, this.currentGroup);
    this.currentGroup.valueChanges
      .debounceTime(150)
      //.distinctUntilChanged()
      .takeWhile(() => this.isAlive)
      .subscribe((s: any) => {
        this.nettoValueUpdate(<IInvoiceLine>s, this.currentGroup);
        if (this.isCorrection.value) {
          //if original has netto value - its a correction.. 
          this.positionListCheckChanges(s);
        }
      });
  }

  isAlive: boolean = true;
  changesInfo: string;
  fontSize: number = 20;


  nettoValueUpdate(s: IInvoiceLine, form: FormGroup) {
    if (s.vat_rate != null && s.unit_price != null && s.quantity != null) {
      let resBrutto: number = 0;
      let resNetto: number = 0;
      let resVat: number = 0;
      let resVatUnit: number = 0;

      //parse Vat_value
      let parsedVatValue = parseInt(s.vat_rate);

      //vat jset zwolniony (0%)
      if (parsedVatValue == 0 || isNaN(parsedVatValue)) {
        resVatUnit = 0;
        resVat = 0;
      } else {
        resVatUnit = s.unit_price * (parsedVatValue / 100);
        resVat = s.quantity * resVatUnit;
      }
      resNetto = s.quantity * s.unit_price;
      resBrutto = resNetto + resVat;

      form.get('brutto_value').setValue(this.cf.roundToCurrency(resBrutto), { emitEvent: false });
      form.get('netto_value').setValue(this.cf.roundToCurrency(resNetto), { emitEvent: false });
      form.get('vat_value').setValue(this.cf.roundToCurrency(resVat), { emitEvent: false });
      form.get('vat_unit_value').setValue(this.cf.roundToCurrency(resVatUnit), { emitEvent: false });
    } else {
      form.get('netto_value').setValue(null, { emitEvent: false });
      form.get('vat_value').setValue(null, { emitEvent: false });
      form.get('vat_unit_value').setValue(null, { emitEvent: false });
    }

    // if(this.isCorrection.value)
    // {
    //   let corrLine=<IInvoiceLine>{
    //     brutto_value: this.currentBruttoValue.value - this.originalBruttoValue.value,
    //     quantity: this.currentQuantity.value-this.originalQuantity.value,
    //     netto_value: this.currentNettoValue.value - this.originalNettoValue.value,
    //     vat_rate: s.vat_rate,
    //     vat_value: this.currentVatValue.value-this.originalVatValue.value
    //   }

    //   this.correctionsGroup.patchValue(corrLine, {emitEvent: false});
    //   this.currentIsCorrected.setValue(true, {emitEvent: false});
    // } else {
    //   this.currentIsCorrected.setValue(false, {emitEvent: false});
    // }

  }

  positionListCheckChanges(s): void {
    let pOrg = <IInvoiceLine>this.originalGroup.value;
    let corrPos = <IInvoiceLine>s;

    let changes: string[] = [];

    if (corrPos.name != pOrg.name) { changes.push('nazwa pozycji'); }
    if (corrPos.pkwiu != pOrg.pkwiu) { changes.push('PKWiU'); }
    if (corrPos.quantity != pOrg.quantity) { changes.push('ilość'); }
    if (corrPos.measurement_unit != pOrg.measurement_unit) { changes.push('jednostka'); }
    if (corrPos.unit_price != pOrg.unit_price) { changes.push('cena jednostkowa'); }
    if (corrPos.vat_rate != pOrg.vat_rate) { changes.push('stawka podatku'); }

    if (changes.length > 0) {
      this.correctionInfo.setValidators(Validators.required);
      this.correctionInfo.updateValueAndValidity();

      //corrPosGroup.setValue(`Korekta: (${changes.join(', ')})`, {emitEvent: false});
      let correctionData: IInvoiceLine = <IInvoiceLine>{}

      correctionData.name = pOrg.name;

      correctionData.brutto_value = corrPos.brutto_value - pOrg.brutto_value;
      correctionData.netto_value = corrPos.netto_value - pOrg.netto_value;
      correctionData.vat_value = corrPos.vat_value - pOrg.vat_value;
      correctionData.vat_unit_value = corrPos.vat_unit_value - pOrg.vat_unit_value;
      correctionData.vat_rate=pOrg.vat_rate;
      

      correctionData.quantity = changes.indexOf('ilość') > -1 ? corrPos.quantity - pOrg.quantity : 0;
      correctionData.unit_price = changes.indexOf('cena jednostkowa') > -1 ? corrPos.unit_price - pOrg.unit_price : 0;

      this.changesInfo = changes.join(', ');
      this.correctionsGroup.patchValue(correctionData, { emitEvent: false });
      this.currentIsCorrected.setValue(true, { emitEvent: false });
    } else {
      this.correctionInfo.clearAsyncValidators();
      this.correctionInfo.updateValueAndValidity();

      this.correctionsGroup.reset({}, { emitEvent: false });
      this.currentIsCorrected.setValue(false, { emitEvent: false });
      this.changesInfo = null;
    }
  }

  removeAt() {
    this.remove.emit(this.rForm);
  }
}
