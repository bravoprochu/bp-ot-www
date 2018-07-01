import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { CurrencyCommonService } from '@bpShared/currency/currency-common.service';
import { Moment } from 'moment';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { MatDatepickerInputEvent } from '@angular/material';


@Component({
  selector: 'app-currency-nbp',
  templateUrl: './currency-nbp.component.html',
  styleUrls: ['./currency-nbp.component.css']
})
export class CurrencyNbpComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup;
  @Input() placeholder: string;


  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }


  constructor(
    private cf: CurrencyCommonService,
    private momentService: MomentCommonService,
  ) { }

  ngOnInit() {
    this.date=this.rateDate.value;
    this.maxDate=this.momentService.getNow();
    
    this.isDestroyed$ = new Subject<boolean>();
    this.placeholder = this.placeholder !== undefined ? this.placeholder : "Wartość";
    
  }

  isDestroyed$: Subject<boolean>;
  maxDate: Moment
  date: Moment;





  //#region rForm getters

  get currency(): FormControl {
    return <FormControl>this.rForm.get('currency');
  }
  get plnValue(): FormControl {
    return <FormControl>this.rForm.get('plnValue');
  }

  get price(): FormControl {
    return <FormControl>this.rForm.get('price');
  }
  get rate(): FormControl {
    return <FormControl>this.rForm.get('rate');
  }

  get rateDate(): FormControl {
    return <FormControl>this.rForm.get('rateDate');
  }
  //#endregion

  dateInputChange(ev: MatDatepickerInputEvent<Moment>){
    if(ev.value){
    console.log('input change...',ev.value.toLocaleString());
    }    
  }

  dateChange(ev: MatDatepickerInputEvent<Date>){
    console.log('date changed', ev.value);
    this.rateDate.setValue(ev.value, {emitEvent: true});
  }

  refresh() {
    this.cf.getNbpService$(this.rForm.value).pipe(
    )
      .subscribe(
        (_data: any) => {
          this.cf.patchCurrencyNbpResult(_data, this.rForm);
          this.rForm.updateValueAndValidity();
        },
      )
  }
}
