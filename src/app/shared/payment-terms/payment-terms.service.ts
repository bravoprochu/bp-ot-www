import { Injectable } from '@angular/core';
import { IPaymentTerm } from './i-payment-term';
import { IPaymentTerms } from './i-payment-terms';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Subject, of, empty, combineLatest } from 'rxjs';
import { merge, takeUntil, tap, delay, startWith, map, switchMap, take, debounceTime } from 'rxjs/operators';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';



@Injectable()
export class PaymentTermsService {

  constructor(
    public mc: MomentCommonService
  ) { }



  getPaymentTerms(): IPaymentTerm[] {
    return [
      {
        paymentTermId: 1,
        name: 'gotówka',
        isDescription: false,
        isPaymentDate: false,
      },
      {
        paymentTermId: 2,
        name: 'gotówka w terminie',
        isDescription: true,
        isPaymentDate: true,
      },
      {
        paymentTermId: 3,
        name: 'przelew',
        isDescription: false,
        isPaymentDate: true,
      },
      {
        paymentTermId: 4,
        name: 'karta płatnicza',
        isDescription: false,
        isPaymentDate: false,
      }
    ];
  }

  getPaymentTermsGroup(fb: FormBuilder, isDestroyed$: Subject<boolean>): FormGroup {
    let paymentDay = `przelew, 60 dni, termin płatności: ${this.mc.getFormatedDate(this.mc.getTodayConstTimeMoment())}`;
    let res = fb.group({
      "combined": [paymentDay],
      "day0": [this.mc.getTodayConstTimeMoment()],
      "description": [null],
      "paymentTerm": fb.control({
        "paymentTermId": 3,
        "name": 'przelew',
        "isDescription": false,
        "isPaymentDate": true
      }),
      "paymentDate": [this.mc.getTodayConstTimeMoment().add(60, "day"), Validators.required],
      "paymentDays": [60, Validators.required],

    });

    let combined: FormControl = <FormControl>res.get('combined');
    let day0: FormControl = <FormControl>res.get('day0');
    let description: FormControl = <FormControl>res.get('description');
    let paymentDate: FormControl = <FormControl>res.get('paymentDate');
    let paymentDays: FormControl = <FormControl>res.get('paymentDays');
    let paymentTerm: FormControl = <FormControl>res.get('paymentTerm');

    //
    // private function for update
    //

    let prepCombine = (): string => {
      //
      // defensive: if date is cleared..
      // 
      let pTerm = paymentTerm.value;
      if (!paymentDays.value || !paymentDate.value) {
        return "błąd";
      }

      if (pTerm.isPaymentDate && paymentDate.value == null) { return; }
      let descr = pTerm.isDescription && description.value != null && description.value.length > 0 ? ", " + description.value : '';
      let pDate = pTerm.isPaymentDate ? `, ${paymentDays.value} dni,  termin płatności: ${this.mc.getFormatedDate(paymentDate.value)}` : '';
      let comb = `${pTerm.name}${pDate}${descr}`;
      combined.patchValue(comb, { emitEvent: false });
      return comb;
    }

    let updatePaymentDateBasedOnDays = (day: moment.Moment, days: number) => {
      if (!day.isValid) { return; }
      if (days < 0) { return; }
      let _date: moment.Moment = day.clone().add(days, "days");
      this.mc.setConstTimeMoment(_date);
      paymentDate.setValue(_date, { emitEvent: false });
    }


    let day0$ = day0.valueChanges.pipe(
      takeUntil(isDestroyed$),
      map((_day: moment.Moment) => {
        if (!_day.isValid) { return empty(); }
        updatePaymentDateBasedOnDays(_day, paymentDays.value);
        return _day;
      })
    )

    let paymentDays$ = paymentDays.valueChanges.pipe(
      takeUntil(isDestroyed$),
      tap((_days: number) => {
        updatePaymentDateBasedOnDays(day0.value, _days);
      }),
      map((d:number)=>{
        if(d<0) {
          paymentDays.setValue(0, {emitEvent: false});
          return 0;
        }
      })
    )


    let paymentDate$ = paymentDate.valueChanges.pipe(
      takeUntil(isDestroyed$),
      debounceTime(500),
      map((_date: moment.Moment) => {
        if (_date == null) {
          return null;
        }
        this.mc.setConstTimeMoment(_date);
        
        let diff = _date.diff(day0.value, "days");

        if(diff<0){
          return null;
        }

        // if (!(moment(<moment.Moment>(day0.value))).isBefore(_date)) {
        //   return null;
        // }
        paymentDays.patchValue(diff, { emitEvent: false });
        paymentDate.patchValue(_date, { emitEvent: false });

        return _date;
      })
    );

    let paymentTerm$ = paymentTerm.valueChanges.pipe(
      takeUntil(isDestroyed$),
      tap((pTerm: IPaymentTerm) => {
        if (pTerm.isPaymentDate) {
          paymentDate.setValidators(Validators.required);
          paymentDays.setValidators(Validators.required);
          paymentDate.updateValueAndValidity({ emitEvent: false })
          paymentDays.updateValueAndValidity({ emitEvent: false })
        } else {
          paymentDate.clearValidators();
          paymentDays.clearValidators();
          paymentDate.updateValueAndValidity({ emitEvent: false })
          paymentDays.updateValueAndValidity({ emitEvent: false })
        }
      }),
    )

    of().pipe(
      takeUntil(isDestroyed$),
      merge(day0$, paymentDate$, paymentDays$, paymentTerm$),
    )
      .subscribe(
        (_data: any) => {
          prepCombine();
        },
      );
    return res;
  }


  patchPaymentTerms(data: IPaymentTerms, rForm: FormGroup) {
    data.day0 = this.mc.convertToConstTime(data.day0);
    data.paymentDate = data.paymentDate ? moment(data.paymentDate) : null;
    rForm.patchValue(data, { emitEvent: false });
    rForm.markAsPristine();
  }


}