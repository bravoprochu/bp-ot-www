import { INavDetailInfo } from '../../shared/interfaces/inav-detail-info';
import { IuserRole } from '../../shared/interfaces/iuser-role';
import { IusersManagement } from '../../shared/interfaces/iusers-management';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDetailObj } from '../../shared/idetail-obj';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersManagementService } from 'app/services/users-management/users-management.service';
import { MatDialog } from '@angular/material';
import { DialogTakNieComponent } from 'app/shared/dialog-tak-nie/dialog-tak-nie.component';
import { IDialogTakNieInfo } from 'app/shared/interfaces/idialog-tak-nie-info';
import { FormControl } from '@angular/forms/src/model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.css']
})
export class UsersManagementComponent implements OnInit, OnDestroy, IDetailObj {
    ngOnDestroy(): void {
        this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
    }

  constructor(private df:UsersManagementService, 
    private dialog: MatDialog,
    private fb:FormBuilder) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initForm();
    this.initData();
  }

  dataObj: any;
  public isDestroyed$:Subject<boolean>;
  isPending: boolean;
  rForm: FormArray;
  routeId: number;
  navDetailInfo: INavDetailInfo=<INavDetailInfo>{
      title: {
          title: "Zarządzanie użytkownikami",
          subtitle:"Przypisywanie uprawnień"
      },
      basicActions: {
        canNotGoBack:true
      }
  }

  roles:FormGroup[]=[];
  rolesList:IuserRole[]=[];
  scopes:string[]=["offers.loads.manage", "offers.vehicles.manage", "companies.employees.me.read", "companies.companies.me.read", "companies.companies.employees.me.read", "exchange-transactions.load-transactions.company-offerer.read", "exchange-transactions.load-transactions.company-contractor.read", "exchange-transactions.vehicle-transactions.company-offerer.read", "exchange-transactions.vehicle-transactions.company-contractor.read", "orders.orders.basic.read", "orders.shipping-orders.basic.create", "tfs.dedicated-orders.basic.read", "tfs.dedicated-orders.basic.create"];


  formDataInit(s:IusersManagement){
    this.rForm=this.fb.array([]);
    s.users.forEach(() => {
        let userGroup= this.userFG();
        this.rForm.push(userGroup);
    });
    this.rolesList=s.roles;
    this.rForm.patchValue(s.users);
  }

   public initForm(): void {
        this.rForm=this.fb.array([]);
    }

    public initRouteId(): void {
        throw new Error('Not implemented yet.');
    }

    public initData(): void {
        this.inProgressDisable()
        this.df.getAll()
        .takeUntil(this.isDestroyed$)
        .subscribe((s:IusersManagement)=> {
            this.formDataInit(s);
            this.inProgressEnable();
        });
    }


    inProgressDisable()
    {
        this.isPending=true;
        this.rForm.disable();        
    }
    inProgressEnable(){
          this.isPending=false;
        this.rForm.enable();          
    }

    public navCancel(): void {
        throw new Error('Not implemented yet.');
    }

    public navDownload(): void {
        throw new Error('Not implemented yet.');
    }

    public navDelete(): void {
        throw new Error('Not implemented yet.');
    }

    public navSave() {
        this.inProgressDisable()
        this.df.updatePackage(this.rForm.value)
        .takeUntil(this.isDestroyed$)
        .subscribe(s=>{
            this.formDataInit(s["data"]);
            this.inProgressEnable();
        });
    }

    private userFG():FormGroup{
        let user= this.fb.group({
            email: [null, Validators.compose([Validators.required, Validators.email])],
            roles:[null],
            status:[null],
            transId: [null],
            transUserSecret: [null],
            transScope:[null],
            userId:[null],
            userName:[null, Validators.compose([Validators.required, Validators.email])],
        });
        return user;
    }


    userRolesDescription(user:any):string{
        let res:string[]=[];
        if(user.value.roles==null || user.value.roles.length==0) return;
        user.value.roles.forEach(userRole=>{
            let idx=this.rolesList.map(m=>m.roleId).indexOf(userRole);
            if(idx>-1) {res.push(this.rolesList[idx].name)}
        });
        return res.join(", ");
    }

    removeAccount(user:FormControl)
    {
        let userName=user.get("userName").value;
        this.dialog.open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{title: `Zarządzanie użytkownikami`, question: `Czy na pewno usunąć konto użytkownika ${userName}`}})
        .afterClosed()
        .subscribe(s=>{
            if(s){
                user.get("status").setValue(3, {emitEvent: false});
                this.rForm.markAsDirty();
            }
        })

    }
}
