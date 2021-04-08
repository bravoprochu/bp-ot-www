import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  merge,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from "rxjs/operators";
import { Subject, empty } from "rxjs";
import { InvoiceSellService } from "../../invoice-sell/services/invoice-sell.service";
import { IInvoicePos } from "../../interfaces/iinvoice-pos";
import { InvoiceCommonFunctionsService } from "../invoice-common-functions.service";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";

@Component({
  selector: "app-invoice-pos",
  templateUrl: "./invoice-pos.component.html",
  styleUrls: ["./invoice-pos.component.css"],
})
export class InvoicePosComponent implements OnInit, OnDestroy {
  @Input() rForm = this.invoiceCommonService.formInvoiceLineGroupGroup(this.fb);
  @Input() isCorrection: FormControl;
  @Output() remove = new EventEmitter();
  @Output() updated = new EventEmitter();
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  changesInfo: string;
  fontSize: number = 20;
  posName: FormControl;
  posPkwiu: FormControl;

  constructor(
    private invoiceCommonService: InvoiceCommonFunctionsService,
    private df: InvoiceSellService,
    private fb: FormBuilder,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.posName = new FormControl(this.rForm?.get("current.name")?.value);
    this.posPkwiu = new FormControl(this.rForm?.get("current.pkwiu")?.value);
    this.initVatValueWatch();

    this.currentQuantity?.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        merge(
          this.currentUnitPrice?.valueChanges,
          this.currentVatRate?.valueChanges
        ),
        debounceTime(1000),
        switchMap((sw) => {
          if (this.rForm?.valid) {
            return this.df
              .calcLineGroup(this.rForm?.value)
              .pipe(takeUntil(this.isDestroyed$));
          } else {
            return empty();
          }
        })
      )
      .subscribe(
        (_data: any) => {
          this.rForm?.setValue(_data, { emitEvent: false });
          this.updated.emit();
          this.rForm?.markAsDirty();
        },
        (err) => console.log("posCalcGroup error", err),
        () => console.log("posCalcGroup finish..")
      );

    this.posName?.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((_data: any) => {
        this.currentGroup.get("name").setValue(_data, { emitEvent: false });
        this.rForm?.markAsDirty();
      });

    this.posPkwiu?.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((_data: any) => {
        this.currentGroup.get("pkwiu").setValue(_data, { emitEvent: false });
        this.rForm?.markAsDirty();
      });
  }

  initVatValueWatch() {
    this.currentVatRate?.valueChanges
      .pipe(
        takeUntil(this.isDestroyed$),
        debounceTime(200),
        distinctUntilChanged(),
        filter((f) => f == "-" || f == "0")
      )
      .subscribe(
        (_vatValue: any) => {
          const _posName: string = this.posName.value;
          let fixedName: string;

          if (
            _posName &&
            _posName.toLocaleLowerCase().includes("usługa transportowa ")
          ) {
            fixedName = _posName.replace(
              "Usługa transportowa ",
              "Usługa transportowa/Transport service "
            );

            this.toastService.toastMake(
              `Wartość pola "nazwa towaru" w pozycji ${this.posName.value} została poprawiona na: "${fixedName}"`,
              "Faktura Sprzedaży"
            );
            this.posName.setValue(fixedName, { emitEvent: true });
          }
        },
        (error) => console.log("_vatValue error", error)
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

      form
        .get("brutto_value")
        .setValue(this.invoiceCommonService.roundToCurrency(resBrutto), {
          emitEvent: false,
        });
      form
        .get("netto_value")
        .setValue(this.invoiceCommonService.roundToCurrency(resNetto), {
          emitEvent: false,
        });
      form
        .get("vat_value")
        .setValue(this.invoiceCommonService.roundToCurrency(resVat), {
          emitEvent: false,
        });
      form
        .get("vat_unit_value")
        .setValue(this.invoiceCommonService.roundToCurrency(resVatUnit), {
          emitEvent: false,
        });
    } else {
      form.get("netto_value").setValue(null, { emitEvent: false });
      form.get("vat_value").setValue(null, { emitEvent: false });
      form.get("vat_unit_value").setValue(null, { emitEvent: false });
    }
    this.rForm?.markAsDirty();
  }

  positionListCheckChanges(): void {
    let pOrg = <IInvoicePos>this.originalGroup.value;
    let currentPos = <IInvoicePos>this.currentGroup.value;
    let changes: string[] = [];

    if (currentPos.name != pOrg.name) {
      changes.push("nazwa pozycji");
    }
    if (currentPos.pkwiu != pOrg.pkwiu) {
      changes.push("PKWiU");
    }
    if (currentPos.quantity != pOrg.quantity) {
      changes.push("ilość");
    }
    if (currentPos.measurement_unit != pOrg.measurement_unit) {
      changes.push("jednostka");
    }
    if (currentPos.unit_price != pOrg.unit_price) {
      changes.push("cena jednostkowa");
    }
    if (currentPos.vat_rate != pOrg.vat_rate) {
      changes.push("stawka podatku");
    }

    if (changes.length > 0) {
      this.correctionInfo.setValidators(Validators.required);
      this.correctionInfo.updateValueAndValidity();
      this.changesInfo = changes.join(", ");
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

  //#region getters

  get correctionsGroup(): FormGroup {
    return this.rForm.get("corrections") as FormGroup;
  }
  get correctionsBruttoValue(): FormControl {
    return this.rForm.get("corrections.brutto_value") as FormControl;
  }
  get correctionsNettoValue(): FormControl {
    return this.rForm.get("corrections.netto_value") as FormControl;
  }
  get correctionsQuantity(): FormControl {
    return this.rForm.get("corrections.quantity") as FormControl;
  }
  get correctionsUnitPrice(): FormControl {
    return this.rForm.get("corrections.unit_price") as FormControl;
  }
  get correctionsVatUnitValue(): FormControl {
    return this.rForm.get("corrections.vat_unit_value") as FormControl;
  }

  get correctionsVatValue(): FormControl {
    return this.rForm.get("corrections.vat_value") as FormControl;
  }

  get correctionInfo(): FormControl {
    return this.rForm.get("current.correctionInfo") as FormControl;
  }

  get currentGroup(): FormGroup {
    return this.rForm.get("current") as FormGroup;
  }

  get currentBruttoValue(): FormControl {
    return this.rForm.get("current.brutto_value") as FormControl;
  }

  get currentIsCorrected(): FormControl {
    return this.rForm.get("current.isCorrected") as FormControl;
  }

  get currentNettoValue(): FormControl {
    return this.rForm.get("current.netto_value") as FormControl;
  }
  get currentQuantity(): FormControl {
    return this.rForm.get("current.quantity") as FormControl;
  }
  get currentUnitPrice(): FormControl {
    return this.rForm.get("current.unit_price") as FormControl;
  }
  get currentVatUnitValue(): FormControl {
    return this.rForm.get("current.vat_unit_value") as FormControl;
  }
  get currentVatRate(): FormControl {
    return this.rForm.get("current.vat_rate") as FormControl;
  }
  get currentVatValue(): FormControl {
    return this.rForm.get("current.vat_value") as FormControl;
  }

  get originalGroup(): FormGroup {
    return this.rForm.get("original") as FormGroup;
  }

  get originalBruttoValue(): FormControl {
    return this.rForm.get("original.brutto_value") as FormControl;
  }

  get originalNettoValue(): FormControl {
    return this.rForm.get("original.netto_value") as FormControl;
  }

  get originalQuantity(): FormControl {
    return this.rForm.get("original.quantity") as FormControl;
  }
  get originalUnitPrice(): FormControl {
    return this.rForm.get("original.unit_price") as FormControl;
  }
  get originalVatUnitValue(): FormControl {
    return this.rForm.get("original.vat_unit_value") as FormControl;
  }

  get originalVatValue(): FormControl {
    return this.rForm.get("original.vat_value") as FormControl;
  }

  //#endregion
}
