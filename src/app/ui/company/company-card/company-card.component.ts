import { DialogDataTypes } from '../../../shared/enums/dialog-data-types.enum';
import { IDialogData } from '../../../shared/interfaces/i-dialog-data';
import { CompanyComponent } from '../company/company.component';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { ICompany } from '../../../shared/interfaces/icompany';

import { Data } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import { MatAutocomplete, MatDialog } from '@angular/material';
import { CompanyService } from 'app/ui/company/services/company.service';
import { empty } from 'rxjs';


@Component({
  selector: 'app-company-card',
  templateUrl: './company-card.component.html',
  styleUrls: ['./company-card.component.css']
})
export class CompanyCardComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }
  @Input() placeholder: string;
  @Input() rForm: FormGroup; //formCompanyGroup
  @Input() fb: FormBuilder
  @ViewChild('ac') ac: MatAutocomplete


  constructor(
    private df: CompanyService,
    private cf: CommonFunctionsService,
    private dialog: MatDialog
  ) {
    this.search$ = new FormControl();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initData();
    this.initForm();
  }

  get addressList(): FormArray {
    return <FormArray>this.rForm.get('addressList');
  }

  get bankAccountList(): FormArray {
    return <FormArray>this.rForm.get('bankAccountList');
  }

  get employeeList(): FormArray {
    return <FormArray>this.rForm.get('employeeList');
  }

  search$: FormControl;
  data$: Observable<any>;
  dataFiltered$: Observable<any[]>;
  isDestroyed$: Subject<boolean>;
  selectedItem: any;



  companyAdd() {
    let dialogData: IDialogData = {
      type: DialogDataTypes.return,
      componentKeyName: 'companyId'
    };
    this.dialog.open(CompanyComponent, { data: dialogData, height: "90%" })
      .afterClosed()
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        if (s != undefined) {
          this.cf.patchCompanyData(s, this.rForm, this.fb);
          this.rForm.markAsDirty();
        }
      })
  }


  displayWith(value) {
    return value != null ? value.nazwa : null;
  }

  initData() {
    //this.data$=this.df.getAll();
  }

  initForm() {
    (<FormArray>this.rForm.get('addressList'))
    //.push(this.cf.formAddressGroup(this.fb));

    this.data$ = this.search$
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .debounceTime(750)
      .distinctUntilChanged()
      .switchMap(sw => {
        if (sw == null || sw == "" || typeof (sw) == "object") { return empty(); }
        else {
          return this.df.getByKey(sw)
            .take(1);
        }
      });

    this.ac.optionSelected
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.cf.patchCompanyData((<ICompany>s.option.value), this.rForm, this.fb);
        this.rForm.markAsDirty();
      });
  }

}