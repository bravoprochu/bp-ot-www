import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ICurrency } from '../interfaces/i-currency';
import { CURRENCY_LIST, CurrencyCommonService } from '../currency-common.service';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { map, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit, OnDestroy {
  @Input() rForm: FormControl;
  @ViewChild(MatAutocomplete) matAuto: MatAutocomplete;


  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private cf: CurrencyCommonService,
  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.search$ = new FormControl(this.rForm.value);
    this.currencyList = CURRENCY_LIST;

    this.rForm.valueChanges.pipe(
      takeUntil(this.isDestroyed$)
    )
    .subscribe(
      (_data:ICurrency)=>{
       if(_data){
         this.search$.setValue(_data, {emitEvent: false});
         this.rForm.markAsDirty();
       }
      },
    )

    this.search$.valueChanges.pipe(
      takeUntil(this.isDestroyed$),
    )
      .subscribe(
        (_data: any) => {
          if (typeof (_data) == "string") {
            _data = _data.toLowerCase();
            this.currencyList = CURRENCY_LIST.filter((v: ICurrency) => {
              return v.name.toLowerCase().includes(_data) || v.description.toLowerCase().includes(_data);
            })
          } else {
            this.rForm.setValue(_data, { emitEvent: true });
          }
        },
    );



  }

  currencyList: ICurrency[];
  isDestroyed$: Subject<boolean>;
  search$: FormControl;

  displayWith(curr: ICurrency) {
    return curr ? curr.name : null;
  }
}
