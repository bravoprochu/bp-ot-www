import { CommonFunctionsService } from "../../../services/common-functions.service";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { Component, OnDestroy, OnInit, Input, ViewChild } from "@angular/core";
import { IEmployee } from "app/other-modules/contractors/interfaces/iemployee";
import { MatSelect } from "@angular/material/select";
import { LoadService } from "app/ui/loads/services/load.service";
import { ILoad } from "app/shared/interfaces/iload";
import { Subject } from "rxjs";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { switchMap, take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-load-sell",
  templateUrl: "./load-sell.component.html",
  styleUrls: ["./load-sell.component.css"],
})
export class LoadSellComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup;
  @Input() fb: FormBuilder;
  @ViewChild("sel", /* TODO: add static flag */ {}) sel: MatSelect;
  contact = [] as IEmployee[];
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  principalEmployees = [] as IEmployee[];

  constructor(
    private cf: CommonFunctionsService,
    private df: LoadService,
    private contractorService: ContractorService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.initForm();
  }

  compareWith(obj1: IEmployee, obj2: IEmployee) {
    if (obj1 == undefined || obj2 == undefined) {
      return;
    }
    return obj1.companyEmployeeId == obj2.companyEmployeeId;
  }

  initForm() {
    this.contact = this.rForm.value.sell.contactPersonsList;
    this.sel.selectionChange
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.contactPersonsList.controls = [];
        s.value.forEach((emp) => {
          this.contactPersonsList.push(
            this.contractorService.formEmployeeGroup(this.fb)
          );
        });
        this.contactPersonsList.patchValue(s.value, { emitEvent: true });
      });

    this.rForm.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s: ILoad) => {
        this.contact = s.sell.contactPersonsList;
      });
  }

  navSave(): void {
    let id = this.rForm.value.loadId != null ? this.rForm.value.loadId : 0;
    this.df
      .updateSell(id, this.rForm.value)
      .pipe(
        switchMap((sw) => this.df.getById(id).pipe(take(1))),
        take(1)
      )
      .subscribe((s) => {
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
      });
  }

  get contactPersonsList(): FormArray {
    return <FormArray>this.rForm.get("sell.contactPersonsList");
  }

  get principal(): FormGroup {
    return <FormGroup>this.rForm.get("sell.principal");
  }

  get principalEmployeeList(): FormArray {
    return <FormArray>this.rForm.get("sell.principal.employeeList");
  }

  get sell(): FormGroup {
    return <FormGroup>this.rForm.get("sell");
  }

  get sellingCompany(): FormGroup {
    return <FormGroup>this.rForm.get("sell.selling_info.company");
  }

  get sellingInfo(): FormGroup {
    return <FormGroup>this.rForm.get("sell.selling_info");
  }

  get sellingPaymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get("sell.selling_info.paymentTerms");
  }

  get sellingPrice() {
    return this.rForm.get("sell.selling_info.price");
  }
}
