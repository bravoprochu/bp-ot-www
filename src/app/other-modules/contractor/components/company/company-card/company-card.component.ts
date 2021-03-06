import { DialogDataTypes } from "../../../../../shared/enums/dialog-data-types.enum";
import { IDialogData } from "../../../../../shared/interfaces/i-dialog-data";
import { CompanyComponent } from "../company/company.component";
import { CommonFunctionsService } from "../../../../../services/common-functions.service";
import { Observable, Subject } from "rxjs/Rx";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatAutocomplete, MatDialog } from "@angular/material";
import { ContractorService } from "../../../services/contractor.service";
import { empty } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { ICompany } from "../../../interfaces/icompany";

@Component({
  selector: "app-company-card",
  templateUrl: "./company-card.component.html",
  styleUrls: ["./company-card.component.css"],
})
export class CompanyCardComponent implements OnInit, OnDestroy {
  @Input() placeholder: string;
  @Input() rForm: FormGroup; //formCompanyGroup
  @Input() fb: FormBuilder;
  @ViewChild("ac") ac: MatAutocomplete;
  search$ = new FormControl("");
  data$: Observable<any>;
  dataFiltered$: Observable<any[]>;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  selectedItem = {} as any;

  constructor(
    private companyService: ContractorService,
    private cf: CommonFunctionsService,
    private dialog: MatDialog
  ) {
    this.search$ = new FormControl();
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initData();
    this.initForm();
  }

  companyAdd(): void {
    let dialogData: IDialogData = {
      type: DialogDataTypes.return,
      componentKeyName: "companyId",
    };
    this.dialog
      .open(CompanyComponent, { data: dialogData, height: "90%" })
      .afterClosed()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        if (s != undefined) {
          this.companyService.patchCompanyData(s, this.rForm, this.fb);
          this.rForm.markAsDirty();
        }
      });
  }

  displayWith(value): string | null {
    return value != null ? value.nazwa : null;
  }

  initData() {}

  initForm() {
    <FormArray>this.rForm.get("addressList");

    this.data$ = this.search$.valueChanges.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((sw) => {
        if (sw == null || sw == "" || typeof sw == "object") {
          return empty();
        } else {
          return this.companyService.getByKey(sw).take(1);
        }
      }),
      takeUntil(this.isDestroyed$)
    );

    this.ac.optionSelected.takeUntil(this.isDestroyed$).subscribe((s) => {
      this.companyService.patchCompanyData(
        <ICompany>s.option.value,
        this.rForm,
        this.fb
      );
      this.rForm.markAsDirty();
    });
  }

  get addressList(): FormArray {
    return <FormArray>this.rForm.get("addressList");
  }

  get bankAccountList(): FormArray {
    return <FormArray>this.rForm.get("bankAccountList");
  }

  get email(): FormControl {
    return this.rForm.get("email") as FormControl;
  }

  get employeeList(): FormArray {
    return <FormArray>this.rForm.get("employeeList");
  }

  get fax(): FormControl {
    return this.rForm.get("fax") as FormControl;
  }

  get firstAddres(): FormGroup {
    return this.addressList.at(0) as FormGroup;
  }

  get vatId(): FormControl {
    return this.rForm.get("vat_id") as FormControl;
  }

  get telephone(): FormControl {
    return this.rForm.get("telephone") as FormControl;
  }

  get url(): FormControl {
    return this.rForm.get("url") as FormControl;
  }
}
