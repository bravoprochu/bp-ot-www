import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IInvoiceLine } from '../../../../shared/interfaces/iinvoice-pos';
import { InvoiceBuyService } from '../../invoice-buy/services/invoice-buy.service';


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

  constructor(
    private cf: CommonFunctionsService,
    private df: InvoiceBuyService

  ) { }

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
  get currentVatRate(): FormControl {
    return <FormControl>this.rForm.get('current.vat_rate');
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
    //this.currentGroup.valueChanges
    this.currentQuantity
    .valueChanges
    .merge(this.currentUnitPrice.valueChanges, this.currentVatRate.valueChanges)
      .debounceTime(150)
      //.distinctUntilChanged()
      .takeWhile(() => this.isAlive)
      .subscribe((s: any) => {
        if(this.currentGroup.valid){
        this.nettoValueUpdate(<IInvoiceLine>this.currentGroup.value, this.currentGroup);
        if (this.isCorrection.value) {
          //if original has netto value - its a correction.. 
          console.log('merge - changeg', this.rForm.value);
          this.positionListCheckChanges();
        }
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
  }

  positionListCheckChanges(): void {
    let pOrg = <IInvoiceLine>this.originalGroup.value;
    let currentPos = <IInvoiceLine>this.currentGroup.value;
    let changes: string[] = [];

    if (currentPos.name != pOrg.name) { changes.push('nazwa pozycji'); }
    if (currentPos.pkwiu != pOrg.pkwiu) { changes.push('PKWiU'); }
    if (currentPos.quantity != pOrg.quantity) { changes.push('ilość'); }
    if (currentPos.measurement_unit != pOrg.measurement_unit) { changes.push('jednostka'); }
    if (currentPos.unit_price != pOrg.unit_price) { changes.push('cena jednostkowa'); }
    if (currentPos.vat_rate != pOrg.vat_rate) { changes.push('stawka podatku'); }

    if (changes.length > 0) {
      this.correctionInfo.setValidators(Validators.required);
      this.correctionInfo.updateValueAndValidity();
      this.changesInfo = changes.join(', ');
      //this.correctionsGroup.patchValue(correctionData, { emitEvent: false });
      this.currentIsCorrected.setValue(true, { emitEvent: false });
    } else {
      this.correctionInfo.clearAsyncValidators();
      this.correctionInfo.updateValueAndValidity();
      this.changesInfo = null;
    }
  }

  removeAt() {
    this.remove.emit(this.rForm);
  }
}
