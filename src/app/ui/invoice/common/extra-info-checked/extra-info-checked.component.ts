import { FormControl,FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';


@Component({
  selector: 'app-extra-info-checked',
  templateUrl: './extra-info-checked.component.html',
  styleUrls: ['./extra-info-checked.component.css']
})
export class ExtraInfoCheckedComponent implements OnInit,OnDestroy {
  ngOnDestroy(): void {
    this.isAlive=false;
  }
@Input() rForm:FormGroup //formExtraInfocheckedGroup
@Input() placeholder: string;
  

  constructor(
    private cf: CommonFunctionsService,
    private momentService: MomentCommonService

  ) { }

  ngOnInit() {
    this.isAlive=true;
    this.initForm();
  }

  isAlive:boolean;

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
    .takeWhile(()=>this.isAlive)
    .subscribe((s:boolean)=>{
      if(s==true)
      {
        this.date.setValidators(Validators.required);
        if(this.date.value==null){
          this.date.setValue(this.momentService.getToday());
        }
      } else {
        this.date.clearValidators();
      }
      this.date.updateValueAndValidity();
    })
  }

}
