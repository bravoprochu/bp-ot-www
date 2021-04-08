import { DialogDataTypes } from "../../../../shared/enums/dialog-data-types.enum";
import { IDialogData } from "../../../../shared/interfaces/i-dialog-data";
import { CompanyComponent } from "../company/company.component";
import { Observable, Subject, empty } from "rxjs";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatDialog } from "@angular/material/dialog";
import { ContractorService } from "../../services/contractor.service";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
} from "rxjs/operators";
import { ICompany } from "../../interfaces/icompany";
import { IContrahentDialogCloseData } from "../../interfaces/i-contrahent-dialog-close-data";

@Component({
  selector: "app-company-card",
  templateUrl: "./company-card.component.html",
  styleUrls: ["./company-card.component.css"],
})
export class CompanyCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() placeholder: string;
  @Input() rForm: FormGroup; //formCompanyGroup
  @Input() fb: FormBuilder;
  @ViewChild("autoComplete") autoComplete: MatAutocomplete;
  search$ = new FormControl("");
  data$: Observable<any>;
  dataFiltered$: Observable<any[]>;
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  selectedItem = {} as any;

  constructor(
    private companyService: ContractorService,
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.autoComplete.optionSelected
        .pipe(takeUntil(this.isDestroyed$))
        .subscribe((s) => {
          this.companyService.patchCompanyData(
            <ICompany>s.option.value,
            this.rForm!,
            this.fb
          );
          this.rForm?.markAsDirty();
        });
    }, 0);
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
      .subscribe((dialogData) => {
        if (
          dialogData &&
          (dialogData.contractor as IContrahentDialogCloseData)
        ) {
          this.companyService.patchCompanyData(
            dialogData.contractor,
            this.rForm!,
            this.fb
          );
          this.rForm?.markAsDirty();
        }
      });
  }

  displayWith(value): string | null {
    return value != null ? value.nazwa : null;
  }

  initData() {}

  initForm() {
    <FormArray>this.rForm?.get("addressList");

    this.data$ = this.search$.valueChanges.pipe(
      debounceTime(750),
      distinctUntilChanged(),
      switchMap((sw) => {
        if (sw == null || sw == "" || typeof sw == "object") {
          return empty();
        } else {
          return this.companyService.getByKey(sw).pipe(take(1));
        }
      }),
      takeUntil(this.isDestroyed$)
    );
  }

  get addressList(): FormArray {
    return <FormArray>this.rForm?.get("addressList");
  }

  get bankAccountList(): FormArray {
    return <FormArray>this.rForm?.get("bankAccountList");
  }

  get email(): FormControl {
    return this.rForm?.get("email") as FormControl;
  }

  get employeeList(): FormArray {
    return <FormArray>this.rForm?.get("employeeList");
  }

  get fax(): FormControl {
    return this.rForm?.get("fax") as FormControl;
  }

  get firstAddres(): FormGroup {
    return this.addressList.at(0) as FormGroup;
  }

  get vatId(): FormControl {
    return this.rForm?.get("vat_id") as FormControl;
  }

  get telephone(): FormControl {
    return this.rForm?.get("telephone") as FormControl;
  }

  get url(): FormControl {
    return this.rForm?.get("url") as FormControl;
  }
}
