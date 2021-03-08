import { IDialogData } from "../../../../shared/interfaces/i-dialog-data";
import { empty, Subject } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { IDetailObj } from "app/shared/idetail-obj";
import { IDialogTakNieInfo } from "../../../../shared/interfaces/idialog-tak-nie-info";
import { DialogTakNieComponent } from "app/other-modules/dialog-tak-nie/components/dialog-tak-nie/dialog-tak-nie.component";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { ContractorService as ContractorService } from "../../services/contractor.service";
import { FormControl } from "@angular/forms";
import { finalize, switchMap, take, takeUntil } from "rxjs/operators";
import { ICompany } from "../../interfaces/icompany";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"],
})
export class CompanyComponent implements OnInit, OnDestroy, IDetailObj {
  isDestroyed$ = new Subject<boolean>() as Subject<boolean>;
  isFormReady = false;
  isPending: boolean;
  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      subtitle: "Edycja danych, tworzenie nowego wpisu",
      title: "Firma",
    },
    basicActions: {
      canNotGoBack: true,
    },
  };

  rForm: FormGroup;
  routeId: number;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private contractorService: ContractorService,
    // private transEuService: TranseuService,
    private companyDialogRef: MatDialogRef<CompanyComponent>,
    private toastService: ToastMakeService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData
  ) {
    if (this.companyDialogRef == undefined) {
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  initRouteId(): void {
    throw new Error("Method not implemented.");
  }

  addressRemove(idx: number): void {
    this.addressList.removeAt(idx);
    this.rForm.markAsDirty();
  }

  dialogOk(): void {
    this.companyDialogRef.close(this.rForm.value);
  }
  dialogCancel(): void {
    this.companyDialogRef.close();
  }

  accountRemove(idx: number): void {
    this.dialog
      .open(DialogTakNieComponent, {
        data: <IDialogTakNieInfo>{
          title: "Kontrahent",
          question: "Czy na pewno usunąć dane konta bankowego ?",
        },
      })
      .afterClosed()
      .subscribe((s) => {
        if (s) {
          this.bankAccountList.removeAt(idx);
        }
      });
  }

  employeeAdd(): void {
    this.employeeList.push(this.employeeGroupAdd());
  }

  employeeRemove(idx: number): void {
    let d = this.dialog.open(DialogTakNieComponent, {
      data: <IDialogTakNieInfo>{
        title: "Kontrahent",
        question: "Czy na pewno usunąć tego użytkownika ?",
      },
    });
    d.afterClosed()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s: boolean) => {
        if (s == true) {
          this.employeeList.removeAt(idx);
          this.rForm.markAsDirty();
        }
      });
  }

  employeeGroupAdd(): FormGroup {
    return this.contractorService.formEmployeeGroup(this.fb);
  }

  employeeRemoveAll(): void {
    while (this.employeeList.length > 0) {
      this.employeeList.removeAt(0);
    }
    this.rForm.markAsDirty();
  }

  initForm(): void {
    this.rForm = this.contractorService.formCompanyGroup(this.fb);
    this.addressList.push(this.contractorService.formAddressGroup(this.fb));
    if (this.dialogData && this.dialogData.formData) {
      this.contractorService.patchCompanyData(
        this.dialogData.formData,
        this.rForm,
        this.fb
      );
    }
    this.isFormReady = true;
  }

  initData(): void {}

  addressAdd(): void {
    this.addressList.push(this.contractorService.formAddressGroup(this.fb));
  }

  bankAccountAdd(): void {
    this.bankAccountList.push(
      this.contractorService.formCompanyBankAccountGroup(this.fb)
    );
  }

  navAccept(): void {
    this.companyDialogRef.close(this.rForm.value);
  }

  navGetCode(): void {
    console.log(JSON.stringify(this.rForm.value));
  }

  navCancel(): void {
    this.companyDialogRef.close();
  }
  navDownload(): void {
    this.initData();
  }

  navDelete(): void {
    console.log("delete...");
    this.isPending = true;

    this.contractorService
      .delete(this.companyId.value)
      .pipe(
        takeUntil(this.isDestroyed$),
        finalize(() => {
          this.isPending = false;
        })
      )
      .subscribe(
        (deleted: any) => {
          console.log("deleted subs:", deleted);
        },
        (error) => console.log("deleted error", error),
        () => console.log("deleted completed..")
      );
  }

  navSave(): void {
    this.isPending = true;
    let id =
      this.rForm.get("companyId").value != null
        ? +this.rForm.get("companyId").value
        : 0;
    this.contractorService
      .update(id, this.rForm.value)
      .pipe(
        take(1),
        switchMap((s) => {
          if (s != null) {
            this.toastService.toastMake(s["info"], "navSave");
            return empty();
          } else {
            return this.contractorService.getById(id).pipe(take(1));
          }
        }),
        takeUntil(this.isDestroyed$),
        finalize(() => {
          this.isPending = false;
        })
      )
      .subscribe((s: ICompany) => {
        this.contractorService.patchCompanyData(s, this.rForm, this.fb, true);
        this.toastService.toastMake(
          `Zaktualizowano dane ${s.short_name} [id: ${s.companyId}]`,
          "navSave"
        );
      });
  }

  // transCompanyById(): void {
  //   this.isPending = true;
  //   let data: IinputData = {
  //     title: "TransEu - Dane kontrahenta",
  //     question: "Wprowadź Id kontrahenta",
  //     inputType: "text",
  //   };
  //   this.dialog
  //     .open(InputDialogComponent, { data: data })
  //     .afterClosed()
  //     .pipe(
  //       switchMap((dialogValue) => {
  //         if (dialogValue == undefined) {
  //           return empty();
  //         }
  //         return this.transEuService.kontrahentById(dialogValue);
  //       }),
  //       switchMap((s) => {
  //         let empUrl = s["_links"]["employees"]["href"];
  //         this.employeeList.controls = [];
  //         this.rForm.patchValue(s);
  //         this.rForm.get("trans_id").patchValue(s["id"]);
  //         this.addressList.at(0).patchValue(s["address"]);
  //         this.addressList.at(0).get("address_type").patchValue("główny");

  //         return this.contractorService.getTransEuEmployeeList(empUrl);
  //       }),
  //       map((m) => {
  //         return m["_embedded"]["companies_employees"];
  //       }),
  //       takeUntil(this.isDestroyed$),
  //       finalize(() => {
  //         this.isPending = true;
  //       })
  //     )
  //     .subscribe((s) => {
  //       (<IEmployee[]>s).forEach(() => {
  //         this.employeeList.push(
  //           this.contractorService.formEmployeeGroup(this.fb)
  //         );
  //       });
  //       this.employeeList.patchValue(s, { emitEvent: false });
  //     });
  // }

  get addressList(): FormArray {
    return <FormArray>this.rForm.get("addressList");
  }

  get bankAccountList(): FormArray {
    return <FormArray>this.rForm.get("bankAccountList");
  }

  get companyId(): FormControl {
    return <FormControl>this.rForm.get("companyId");
  }

  get employeeList(): FormArray {
    return <FormArray>this.rForm.get("employeeList");
  }

  get empArr(): FormArray {
    return <FormArray>this.rForm.get("employees");
  }

  get isDialogData(): boolean {
    return this.dialogData ? true : false;
  }
}
