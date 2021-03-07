import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { Moment } from "moment";
import { MomentCommonService } from "@bpShared/moment-common/moment-common.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-currency-nbp",
  templateUrl: "./currency-nbp.component.html",
  styleUrls: ["./currency-nbp.component.css"],
})
export class CurrencyNbpComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup;
  @Input() placeholder: string;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  maxDate: Moment;

  constructor(
    private cf: CurrencyCommonService,
    private momentService: MomentCommonService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }

  ngOnInit() {
    this.maxDate = this.momentService.getNow();
    this.placeholder =
      this.placeholder !== undefined ? this.placeholder : "Wartość";
  }

  //#region rForm getters

  get currency(): FormControl {
    return <FormControl>this.rForm.get("currency");
  }
  get plnValue(): FormControl {
    return <FormControl>this.rForm.get("plnValue");
  }

  get price(): FormControl {
    return <FormControl>this.rForm.get("price");
  }
  get rate(): FormControl {
    return <FormControl>this.rForm.get("rate");
  }

  get rateDate(): FormControl {
    return <FormControl>this.rForm.get("rateDate");
  }
  //#endregion

  refresh() {
    this.cf
      .getNbpService$(this.rForm.value)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((_data: any) => {
        this.cf.patchCurrencyNbpResult(_data, this.rForm);
        this.rForm.updateValueAndValidity();
      });
  }
}
