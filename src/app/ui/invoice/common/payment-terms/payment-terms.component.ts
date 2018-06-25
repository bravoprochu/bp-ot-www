import { OnDestroy, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { MatSelect } from '@angular/material';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { isDate, isNumber } from 'util';
import { IPaymentTerm } from '../../../../shared/interfaces/iinvoice-payment-terms';


@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isActive=false;
  }
  @Input() rForm: FormGroup; //formPaymentTermsGroup
  @ViewChild('paymentTerms') paymentTerms: MatSelect;

   

  constructor(
    private cf: CommonFunctionsService,
    private fb: FormBuilder,
  ) {}

  get paymentTerm()
  {
    return this.rForm.get('paymentTerm');
  }

  isActive:boolean
  select:FormControl;

  ngOnInit() {
    this.isActive=true;
    //setting options
    this.paymentTermsArr=this.cf.paymentTerms();
    //setting init option from rForm value
    this.selectedTerm=this.rForm.value.paymentTerm;
    this.formPaymentDate.setValue(this.diffDates())
    
    
    this.rForm.get('paymentTerm')
    .valueChanges
    .takeWhile(()=>this.isActive)
    .subscribe(s=>{
        this.selectedTerm=s;
    });


    this.formDay0
    .valueChanges
    .debounceTime(500)
    .distinctUntilChanged()
    .takeWhile(()=>this.isActive)
    .subscribe(s=>{
      this.formPaymentDate.setValue(this.diffDates(), {emitEvents: false});
    });

    this.formPaymentDays
    .valueChanges
    .debounceTime(500)
    .distinctUntilChanged()
    .takeWhile(()=>this.isActive)
    .subscribe(s=>{
      this.formPaymentDate.setValue(this.diffDates(), {emitEvents: false});
    });

    this.formPaymentDate
    .valueChanges
    .debounceTime(500)
    .distinctUntilChanged()
    .takeWhile(()=>this.isActive)
    .subscribe(s=>{
      this.formPaymentDays.setValue(this.diffDays(), {emitEvents: false});
    });


    
    // this.formDay0.valueChanges.merge(this.formPaymentDays.valueChanges, this.formPaymentDate.valueChanges)
    // .debounceTime(250)
    // .takeWhile(()=>this.isActive)
    // .subscribe(s=>{
    //   let date=this.formPaymentDate;
    //   let days=this.formPaymentDays;
    //   let selDate=this.formDay0;
     
    //   if(selDate.value==null) {selDate.patchValue(new Date().toISOString().slice(0,10), {emitEvent:false})}
    //   //zmienia się ilosc dni
    //   if(typeof s == "number"){
    //     date.setValue(this.diffDates(), {emitEvent:false} );
    //   } else{
    //     //zmienia sie data
    //     if(date.value==null){
    //       date.patchValue(this.diffDates(), {emitEvent:false});

    //     } else {
    //       days.patchValue(this.diffDays(), {emitEvent: false});

    //     }
    //   }
    // })


  }


  compareWith(obj1:IPaymentTerm, obj2:IPaymentTerm)
  {
    return obj1.paymentTermId==obj2.paymentTermId;
  }


  findSelectedTermIdx():number{
    let rFormPaymentTerm=<IPaymentTerm>this.rForm.get('paymentTerm').value;
    let res:number;
    let idx:number=0;
    this.paymentTermsArr.forEach((paymentTerm: IPaymentTerm)=>{
      if(paymentTerm.paymentTermId==rFormPaymentTerm.paymentTermId) {
        res=idx;
      };
      idx++
    })
    return res;
  }


  paymentTermsArr:IPaymentTerm[];
  paymentTermSelectedModel:string=this.cf.paymentTerms()[2].name;
  selectedTerm: IPaymentTerm;


  diffDates():string{
    return moment(this.formDay0.value, this.cf.dateLocaleFormat()).add(this.formPaymentDays.value, "day").format(this.cf.dateLocaleFormat());
  }

  diffDays():number{
    let date=this.formPaymentDate;
    let selDate=this.formDay0;
    //return 0;
    return moment(date.value? date.value : selDate.value, this.cf.dateLocaleFormat()).diff(moment(selDate.value, this.cf.dateLocaleFormat()), 'days');
  }

  get formDescritpion(){
    return this.rForm.get('description');
  }
  get formPaymentDays(){
    return this.rForm.get('paymentDays');
  }
  get formPaymentDate(){
    return this.rForm.get('paymentDate');
  }
  get formPaymentTerm(){
    return this.rForm.get('paymentTerm');
  }
  get formDay0(){
    return this.rForm.get('day0');
  }

  filterData(val: string){
    return typeof val ==="string" ? this.paymentTermsArr.filter((p)=>{
      return p.name.toLowerCase().includes(val.toLowerCase());
    }): this.paymentTermsArr
  }

  paymentFormUpdate(val: IPaymentTerm){
    if(val==undefined) return;
    this.formPaymentDate.reset();
    this.formDescritpion.reset();
    this.formPaymentDays.reset();
    this.formDescritpion.clearValidators();
    this.formPaymentDays.clearValidators();
    this.formPaymentDate.clearValidators();
    this.updateFormFields();
    this.rForm.updateValueAndValidity({emitEvent: true});
    if(val.isDescription){
      this.formDescritpion.setValidators([Validators.required, Validators.minLength(3)]);
      this.formDescritpion.updateValueAndValidity();
    } 
    if(val.isPaymentDate){
      this.formPaymentDate.setValidators(Validators.required);
      this.formPaymentDays.setValidators(Validators.compose([Validators.required, Validators.min(1)]));
      this.formPaymentDate.updateValueAndValidity();
      this.formPaymentDays.updateValueAndValidity();
    } 
    //this.rForm.updateValueAndValidity();
  }

  paymentTermChanged(){
    this.paymentTerm.patchValue(this.selectedTerm);
    this.paymentFormUpdate(this.selectedTerm);
    this.rForm.markAsDirty();
  }


  private updateFormFields(){
    this.formDescritpion.updateValueAndValidity();
    this.formPaymentDate.updateValueAndValidity();
    this.formPaymentDays.updateValueAndValidity();
  }
}
