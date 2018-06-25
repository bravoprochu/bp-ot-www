import { OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatSelect } from '@angular/material';
import { isDate, isNumber } from 'util';
import { PaymentTermsService } from '../payment-terms.service';
import { IPaymentTerm } from '../i-payment-term';
import { DEFAULT_APP_VALUES } from 'environments/environment';
import * as moment from 'moment';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit, OnDestroy {

  
  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }
  @Input() rForm: FormGroup; //formPaymentTermsGroup
  @ViewChild(MatSelect) matSelect: MatSelect;

  constructor(
    private cf: PaymentTermsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    //
    // setting options
    //

    
    this.paymentTermsArr = this.cf.getPaymentTerms();
    // this.initComponentObservable();
  }



  isDestroyed$: Subject<boolean>;
  minDate: moment.Moment;
  paymentTermsArr: IPaymentTerm[];


  // initComponentObservable() {
  //   this.formDay0.valueChanges.pipe(
  //     takeUntil(this.isDestroyed$)
  //   )
  //     .subscribe(
  //       (_data: any) => {
  //         this.formatDay0();
  //       },
  //   )
  // }

  compareWith(obj1: IPaymentTerm, obj2: IPaymentTerm) {
    return obj2 ? obj1.paymentTermId == obj2.paymentTermId : null;
  }


  // formatDay0() {
  //   let _minDate: moment.Moment = moment(this.rForm.get('day0').value);
  //   let d = _minDate.format(DEFAULT_APP_VALUES.dateLocalFormat);
  //   this.minDate = _minDate;
  // }





  //#region rForm getters

  get formDescritpion() {
    return this.rForm.get('description');
  }

  get formDay0(): FormControl {
    return <FormControl>this.rForm.get('day0');
  }

  get formPaymentDays() {
    return this.rForm.get('paymentDays');
  }
  get formPaymentDate() {
    return this.rForm.get('paymentDate');
  }
  get formPaymentTerm(): FormGroup {
    return <FormGroup>this.rForm.get('paymentTerm');
  }

  get isDescription(): boolean {
    return <boolean>this.rForm.get('paymentTerm').value.isDescription;
  }
  get isPaymentDate(): boolean {
    return <boolean>this.rForm.get('paymentTerm').value.isPaymentDate;
  }

  get paymentTerm() {
    return this.rForm.get('paymentTerm');
  }

  // get minDate():string {
  //   let _day0= this.rForm.get('day0');
  //   return _day0 && (_day0.value.isValid()) ? (_day0.value).format(DEFAULT_APP_VALUES.dateLocalFormat) : this.cf.mc.getFormatedDate();
  // }

  //#endregion

}
