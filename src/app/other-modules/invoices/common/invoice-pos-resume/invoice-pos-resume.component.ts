import { FormGroup, FormControl } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';



@Component({
  selector: 'app-invoice-pos-resume',
  templateUrl: './invoice-pos-resume.component.html',
  styleUrls: ['./invoice-pos-resume.component.css']
})
export class InvoicePosResumeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isAlive=false;
  }
  @Input() rForm: FormGroup //formInvoice
  @Input() isCorrection: FormControl;
  constructor() { }

  ngOnInit() {  }

  
  isAlive:boolean=true;


  get corrections():FormGroup
  {
    return <FormGroup>this.rForm.get('corrections');
  }

  get current():FormGroup
  {
    return <FormGroup>this.rForm.get('current');
  }

  get original():FormGroup
  {
    return <FormGroup>this.rForm.get('original');
  }
}
