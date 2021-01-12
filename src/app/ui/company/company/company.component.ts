import { IEmployee } from '../../../shared/interfaces/iemployee';
import { ITransEuPerson } from '../../../shared/interfaces/i-load-trans-eu';
import { ICompany } from '../../../shared/interfaces/icompany';
import { IDialogData } from '../../../shared/interfaces/i-dialog-data';
import { DialogDataTypes } from '../../../shared/enums/dialog-data-types.enum';
import { Observable, Subject } from 'rxjs/Rx';
import { InputDialogComponent } from '../../../shared/input-dialog/input-dialog.component';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { IBasicActions } from 'app/shared/ibasic-actions';
import { IDetailObj } from 'app/shared/idetail-obj';
import { ITitle } from 'app/shared/ititle';

import { TranseuService } from '../../../services/transeu/transeu.service';
import { IDialogTakNieInfo } from '../../../shared/interfaces/idialog-tak-nie-info';
import { DialogTakNieComponent } from 'app/shared/dialog-tak-nie/dialog-tak-nie.component';
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { CompanyService } from 'app/ui/company/services/company.service';
import { FormControl } from '@angular/forms/src/model';
import { IinputData } from '@bpCommonInterfaces/iinput-data';



@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy, IDetailObj {
  initRouteId(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

 constructor(
      private dialog: MatDialog,
      private cf: CommonFunctionsService,
      private fb: FormBuilder, 
      private actRoute:ActivatedRoute,
      private df: CompanyService, 
      private transEuService: TranseuService,
      private companyDialogRef : MatDialogRef<CompanyComponent>,
      @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData
      )
   {
     if(this.companyDialogRef==undefined){
     }
   }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.initForm();
    this.initData();
  }


  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title:{
          subtitle: "Edycja danych, tworzenie nowego wpisu",
    title: "Firma"
    },
    basicActions:{
      canNotGoBack:true
    }
  };

  isDestroyed$:Subject<boolean>;
  isPending:boolean;

  rForm: FormGroup;
  routeId:number;



  get addressList():FormArray{
    return (<FormArray>this.rForm.get('addressList'));
  }

  get companyId():FormControl
  {
    return <FormControl>this.rForm.get('companyId');
  }

  get employeeList():FormArray{
    return <FormArray>this.rForm.get("employeeList");
  }

  get isDialogData():boolean
  {
    return this.dialogData?true:false;
  }


  addressRemove(idx:number){
    this.addressList.removeAt(idx);
    this.rForm.markAsDirty();
  }

  dialogOk(ev:any){
    this.companyDialogRef.close(this.rForm.value);
  }
  dialogCancel(){
    this.companyDialogRef.close();
  }

  empArr():FormArray{
    return <FormArray>this.rForm.get("employees");
  }



  accountRemove(idx:number){
    this.dialog.open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{title:"Kontrahent", question:"Czy na pewno usunąć dane konta bankowego ?"}})
    .afterClosed()
    .subscribe(s=>{
      if(s){
        this.bankAccountList.removeAt(idx);
      }
    });
  }

  employeeAdd(){
    this.employeeList.push(this.employeeGroupAdd());
  }

  employeeRemove(idx:number){
    let d= this.dialog.open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{title:"Kontrahent", question:"Czy na pewno usunąć tego użytkownika ?"}});
    d.afterClosed()
    .takeUntil(this.isDestroyed$)
    .subscribe((s:boolean)=>{
      if(s==true){
        this.employeeList.removeAt(idx);
        this.rForm.markAsDirty();
      }
    });
  }

  employeeGroupAdd(){
    return this.cf.formEmployeeGroup(this.fb);
  }

  employeeRemoveAll()
  {
    while (this.employeeList.length>0) {
      this.employeeList.removeAt(0);
    }
    this.rForm.markAsDirty();

  }

  // employeeTrackBy(index, employee:IEmployee){
  //   return employee? employee.id: undefined;
  // }


  initForm(){
    this.rForm=this.cf.formCompanyGroup(this.fb);
    this.addressList.push(this.cf.formAddressGroup(this.fb));
    if(this.dialogData && this.dialogData.formData){
        // (<ICompany>this.dialogData.formData).employeeList.forEach(emp=>{
        //   (<FormArray>this.rForm.get('employeeList')).push(this.cf.formEmployeeGroup(this.fb));
        // });
        // (<ICompany>this.dialogData.formData).bankAccountList.forEach(acc=>{
        //   (<FormArray>this.rForm.get('bankAccountList')).push(this.cf.formCompanyBankAccountGroup(this.fb));
        // })
        this.cf.patchCompanyData(this.dialogData.formData, this.rForm, this.fb);
    }

     
  }

  initData():void{
  }

  get bankAccountList():FormArray{
    return <FormArray>this.rForm.get('bankAccountList');
  }

  addressAdd(){
    this.addressList.push(this.cf.formAddressGroup(this.fb));
  }

  bankAccountAdd(){
    this.bankAccountList.push(this.cf.formCompanyBankAccountGroup(this.fb));
  }

  
  navAccept()
  {
    this.companyDialogRef.close(this.rForm.value);
  }

  navGetCode(){
    console.log(JSON.stringify(this.rForm.value));
  }

  navCancel(){
    this.companyDialogRef.close();
  }
  navDownload(){
    this.initData();
  }
  
  navDelete(){
    this.df.delete(this.routeId);
  }
  navSave(){
    let id=this.rForm.get('companyId').value !=null ? +this.rForm.get('companyId').value : 0;
      this.df.update(id, this.rForm.value)
      .take(1)
      .switchMap(s=>{
        if(s!=null){
        this.cf.toastMake(s["info"], "navSave", this.actRoute);
        return Observable.empty();
        } else {
          return this.df.getById(id)
          .take(1);
        }
      })
      .take(1)
      .subscribe((s:ICompany)=>{
        this.cf.patchCompanyData(s, this.rForm, this.fb, true);
        this.cf.toastMake(`Zaktualizowano dane ${s.short_name} [id: ${s.companyId}]`, "navSave", this.actRoute);
      })
  }


  transCompanyById(){
    let data:IinputData={
      title: "TransEu - Dane kontrahenta",
      question: "Wprowadź Id kontrahenta",
      inputType: "text"
    }
    return this.dialog.open(InputDialogComponent, {data: data})
      .afterClosed()
      .switchMap(dialogValue=>{
        if(dialogValue==undefined) {return Observable.empty()}
        return this.transEuService.kontrahentById(dialogValue)
//          .retryWhen(err=>err.delay(2500).take(1))
      }       
    )
    .do(()=>this.isPending=false)
    .switchMap(s=>{
      let empUrl=s['_links']['employees']['href'];
      //this.rForm.reset();
      this.employeeList.controls=[];
      this.rForm.patchValue(s);
      this.rForm.get('trans_id').patchValue(s['id']);
      //this.rForm.get('companyId').patchValue(0);
      this.addressList.at(0).patchValue(s['address']);
      this.addressList.at(0).get('address_type').patchValue("główny");

      return this.df.getTransEuEmployeeList(empUrl);
    })
    .map(m=>{
      return m['_embedded']['companies_employees'];
    })
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      (<IEmployee[]>s).forEach(emp=>{
        this.employeeList.push(this.cf.formEmployeeGroup(this.fb));
      });
      this.employeeList.patchValue(s, {emitEvent:false});
    });
    
  }


 
}
