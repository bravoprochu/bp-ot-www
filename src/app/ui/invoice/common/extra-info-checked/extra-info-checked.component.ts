import { FormControl,FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-extra-info-checked',
  templateUrl: './extra-info-checked.component.html',
  styleUrls: ['./extra-info-checked.component.css']
})
export class ExtraInfoCheckedComponent implements OnInit,OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
  }
@Input() rForm:FormGroup //formExtraInfocheckedGroup
@Input() placeholder: string;
  

  constructor(
    private cf: CommonFunctionsService
  ) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.initForm();
  }

  isDestroyed$: Subject<boolean>;

  get checked():FormControl
  {
    return <FormControl>this.rForm.get('checked')
  }

    get date():FormControl
  {
    return <FormControl>this.rForm.get('date')
  }
    get info():FormControl
  {
    return <FormControl>this.rForm.get('info')
  }


  initForm()
  {
    this.rForm.get('checked')
    .valueChanges
    .startWith(false)
    .takeUntil(this.isDestroyed$)
    .subscribe((s:boolean)=>{
      if(s==true)
      {
        this.date.setValidators(Validators.required);
        if(this.date.value==null){
          this.date.setValue(this.cf.momentService.getTodayConstTimeMoment());
        }
      } else {
        this.date.clearValidators();
      }
      this.date.updateValueAndValidity();
    })
  }

}
