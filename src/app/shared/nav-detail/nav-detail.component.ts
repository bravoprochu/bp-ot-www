import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IBasicActions } from "app/shared/ibasic-actions";
import { MatDialog } from "@angular/material";
import { DialogTakNieComponent } from "app/shared/dialog-tak-nie/dialog-tak-nie.component";
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, UrlSegment, Router } from "@angular/router";
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-nav-detail',
  templateUrl: './nav-detail.component.html',
  styleUrls: ['./nav-detail.component.css']
})
export class NavDetailComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }
  @Input() dialogData?: any;
  @Input() rForm:FormGroup
  @Input() public navDetailInfo:INavDetailInfo;
  @Output() navGetCode=new EventEmitter();
  @Output() navCancel=new EventEmitter();
  @Output() navDownload=new EventEmitter();
  @Output() navDelete=new EventEmitter();
  @Output() navSave=new EventEmitter();
  @Output() navDialogOk=new EventEmitter();
  @Output() navDialogCancel=new EventEmitter();

  constructor(public dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.activeRoute.paramMap
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      let id=+s.get("id");
    })
  }

  
  isDestroyed$: Subject<boolean>;

  getCode(){
    console.log(JSON.stringify(this.rForm.value));
  }

  get dialogKeyValid():boolean{
    if(this.dialogData && this.dialogData['componentKeyName']){
      return this.rForm.get(this.dialogData['componentKeyName']).value>0;
    }
  }

  goBack(){
    this.activeRoute.url
    .takeUntil(this.isDestroyed$)
    .subscribe((s)=>{
      this.router.navigateByUrl(s[0].path);
    });
  }

  cancel(){
//    this.openDialog();
    this.navCancel.emit();
  }

  dialogCancel(){
    this.navDialogCancel.emit();
  }

  dialogOk(){
    this.navDialogOk.emit();  
  }

  download(){
    this.navDownload.emit();
  }
  delete(){
    this.navDelete.emit();
  }

  save(){
    this.navSave.emit();
  }



  openDialog(){
    let dialogRef=this.dialog.open(DialogTakNieComponent,{ width:'100%',height:'100%' });
    dialogRef.afterClosed()
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>console.log(s));
  }

}
