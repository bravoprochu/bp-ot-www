import { OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MatSelect, MatDatepickerInputEvent } from '@angular/material';
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
  @Input() rForm: FormGroup; //formPaymentTermsGroup
  @ViewChild(MatSelect) matSelect: MatSelect;
  
 
  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
  }

  constructor(
    private cf: PaymentTermsService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.paymentTermsArr = this.cf.getPaymentTerms();
  }



  isDestroyed$: Subject<boolean>;
  minDate: moment.Moment;
  paymentTermsArr: IPaymentTerm[];


  compareWith(obj1: IPaymentTerm, obj2: IPaymentTerm) {
    return obj2 ? obj1.paymentTermId == obj2.paymentTermId : null;
  }


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
  //#endregion

}
