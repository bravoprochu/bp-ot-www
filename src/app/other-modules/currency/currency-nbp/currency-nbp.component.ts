import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { combineLatest, EMPTY, noop, Observable, of, Subject } from "rxjs";
import {
  CurrencyCommonService,
  CURRENCY_LIST,
} from "app/other-modules/currency/currency-common.service";
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { ICurrencyNbp } from "../interfaces/i-currency-nbp";
import { ICurrency } from "../interfaces/i-currency";
import { twoDigitsFormat } from "app/common-functions/format/two-digits-format";

@Component({
  selector: "app-currency-nbp",
  templateUrl: "./currency-nbp.component.html",
  styleUrls: ["./currency-nbp.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyNbpComponent implements OnInit, OnDestroy {
  @Input() controlContainerParentRef = [] as string[];
  @Input() controlContainerRef = "currencyNbp";
  @Input() set formData(currencyNbp: ICurrencyNbp) {
    this.isDataChanged.next();
    this.initForm();
    this.prepInitIncomingData(currencyNbp);
    this.prepCurrencyData(currencyNbp);
    this.initObservables();
  }
  @Input() placeholder = "Wartość";

  currencyParentRef = [] as string[];
  currencyData = CURRENCY_LIST.find((currency) => currency.name === "EUR");
  isLoading = false;
  maxDate = new Date();
  reactiveForm = new FormGroup({});

  currency$ = of(null);

  rateDate$ = of(null);

  price$ = of(0);

  isExchangeInfoDisabled$ = of(false);

  private isDataChanged = new Subject<void>();
  private isDestroyed$ = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private controlContainer: ControlContainer,
    private fb: FormBuilder,
    private currencyCommonService: CurrencyCommonService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next();
    this.isDestroyed$.complete();

    this.isDataChanged.next();
    this.isDataChanged.complete();
  }

  ngOnInit() {}

  initObservables(): void {
    this.currency$ = this.reactiveForm.valueChanges.pipe(
      map((currencyNbp: ICurrencyNbp) => currencyNbp.currency)
    );

    this.rateDate$ = this.reactiveForm.valueChanges.pipe(
      map((currencyNbp: ICurrencyNbp) => currencyNbp.rateDate),
      startWith(this.rateDate.value),
      takeUntil(this.isDataChanged)
    ) as Observable<string>;

    this.price$ = this.reactiveForm.valueChanges.pipe(
      map((currencyNbp: ICurrencyNbp) => currencyNbp.price),
      startWith(this.price.value),
      debounceTime(750),
      distinctUntilChanged(),
      takeUntil(this.isDataChanged)
    ) as Observable<number>;

    combineLatest([this.price$, this.rateDate$, this.currency$])
      .pipe(
        tap(() => {
          this.isLoading = true;
          this.reactiveForm.markAsPending();
          this.changeDetectorRef.detectChanges();
        }),
        debounceTime(750),
        switchMap(([price, rateDate, currency]) => {
          const isPln =
            (currency as ICurrency) && currency.name && currency.name === "PLN";

          if (!price || !currency) {
            return EMPTY;
          }
          if (isPln) {
            const cleanNbp = {
              currency,
              plnValueFormatted: twoDigitsFormat(price),
              plnValue: price,
              price,
              rate: 1,
              rateDate,
              no: null,
              table: null,
            } as ICurrencyNbp;

            this.reactiveForm.setValue(cleanNbp, { emitEvent: false });
            return EMPTY;
          }

          const nbp = {
            price,
            rateDate,
            currency,
          } as ICurrencyNbp;

          return this.currencyCommonService
            .getExchangeFromNbpService$(nbp)
            .pipe(
              take(1),
              map((currencyNbp: ICurrencyNbp) => {
                this.reactiveForm.patchValue(currencyNbp, { emitEvent: false });
                this.changeDetectorRef.detectChanges();

                return currencyNbp;
              }),
              finalize(() => (this.isLoading = false))
            );
        })
      )
      .subscribe(noop);
  }

  private initForm(): void {
    let parent: FormGroup;
    if (this.controlContainerParentRef.length === 0) {
      parent = this.controlContainer.control as FormGroup;
    } else {
      parent = this.controlContainer.control.get(
        this.controlContainerParentRef
      ) as FormGroup;
    }

    const reactiveForm = this.fb.group({
      price: [
        null,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      plnValue: [0],
      plnValueFormatted: [],
      rate: [0],
      rateDate: [new Date()],
      table: [null],
      no: [null],
    });

    parent.setControl(this.controlContainerRef, reactiveForm);

    this.reactiveForm = this.controlContainer.control.get([
      ...this.controlContainerParentRef,
      this.controlContainerRef,
    ]) as FormGroup;
  }

  private prepInitIncomingData(currencyNbp: ICurrencyNbp): void {
    this.reactiveForm.patchValue(currencyNbp);
  }

  private prepCurrencyData(currencyNbp: ICurrencyNbp): void {
    this.currencyParentRef = [
      ...this.controlContainerParentRef,
      this.controlContainerRef,
    ];

    this.currencyData = currencyNbp.currency;
  }

  //#region reactiveForm getters

  get isExchangeInfo(): boolean {
    if (this.reactiveForm.status === "PENDING") return false;

    const currencyFC = this.reactiveForm.get("currency");
    if (!currencyFC) return false;
    const currencyValue = currencyFC.value as ICurrency;

    const codeTable = this.reactiveForm.get("table");
    if (!codeTable.value) return false;

    return currencyValue && currencyValue.name && currencyValue.name !== "PLN";
  }

  get combinedInfo(): string {
    return this.currencyCommonService.prepCombinedInfoNbp(
      this.reactiveForm.value
    );
  }

  get plnValue(): FormControl {
    return this.reactiveForm.get("plnValueFormatted") as FormControl;
  }

  get price(): FormControl {
    return this.reactiveForm.get("price") as FormControl;
  }
  get rate(): FormControl {
    return this.reactiveForm.get("rate") as FormControl;
  }

  get rateDate(): FormControl {
    return this.reactiveForm.get("rateDate") as FormControl;
  }
  //#endregion
}
