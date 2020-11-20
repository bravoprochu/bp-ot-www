import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { IInvoicePos } from '@bpUI/invoice/interfaces/iinvoice-pos';
import { merge, takeUntil, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Subject, empty } from 'rxjs';
import { InvoiceSellService } from '@bpUI/invoice/invoice-sell/services/invoice-sell.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-invoice-pos',
  templateUrl: './invoice-pos.component.html',
  styleUrls: ['./invoice-pos.component.css']
})
export class InvoicePosComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup;
  @Input() isCorrection: FormControl;
  @Output() remove = new EventEmitter();
  @Output() updated = new EventEmitter();

  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private cf: CommonFunctionsService,
    private df: InvoiceSellService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();

    this.posName = new FormControl(this.rForm.get('current.name').value);
    this.posPkwiu = new FormControl(this.rForm.get('current.pkwiu').value);
    this.initVatValueWatch()


    this.currentQuantity
      .valueChanges.pipe(
        takeUntil(this.isDestroyed$),
        merge(this.currentUnitPrice.valueChanges, this.currentVatRate.valueChanges),
        debounceTime(1000),
        switchMap(sw => {
          if (this.rForm.valid) {
            return this.df.calcLineGroup(this.rForm.value).pipe(
              takeUntil(this.isDestroyed$)
            )
          } else {
            return empty();
          }
        })
      )
      .subscribe(
        (_data: any) => {
          this.rForm.setValue(_data, {emitEvent: false});
          this.updated.emit();
          this.rForm.markAsDirty();
        },
        (err) => console.log('posCalcGroup error', err),
        () => console.log('posCalcGroup finish..')

      )


    this.posName.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        (_data: any) => {
          this.currentGroup.get('name').setValue(_data, { emitEvent: false });
          this.rForm.markAsDirty();
        },
      )

    this.posPkwiu.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(
        (_data: any) => {
          this.currentGroup.get('pkwiu').setValue(_data, { emitEvent: false });
          this.rForm.markAsDirty();
        },
    )

  }

  isDestroyed$: Subject<boolean>;
  changesInfo: string;
  fontSize: number = 20;
  posName: FormControl;
  posPkwiu: FormControl;

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



  //#endregion


  initVatValueWatch() {
    this.currentVatRate.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
      debounceTime(200),
      distinctUntilChanged(),
      filter(f=>f=="-" || f=="0")
    )
    .subscribe(
         (_vatValue:any)=>{
              const _posName: string = this.posName.value;
              let fixedName: string;
              
              if(_posName && _posName.toLocaleLowerCase().includes('usługa transportowa ')){
                fixedName = _posName.replace('Usługa transportowa ', "Usługa transportowa/Transport service ");
                
                this.cf.toastMake(`Wartość pola "nazwa towaru" w pozycji ${this.posName.value} została poprawiona na: "${fixedName}"`, 'Faktura Sprzedaży', this.actRoute);
                this.posName.setValue(fixedName, {emitEvent: true});
              }
         },
         (error)=>console.log('_vatValue error', error),
    );
  }

  nettoValueUpdate(s: IInvoicePos, form: FormGroup) {
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
    this.rForm.markAsDirty();
  }

  positionListCheckChanges(): void {
    let pOrg = <IInvoicePos>this.originalGroup.value;
    let currentPos = <IInvoicePos>this.currentGroup.value;
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


