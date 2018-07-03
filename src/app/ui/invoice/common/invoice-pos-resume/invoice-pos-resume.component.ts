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




  // get InvoicePosList(){
  //   return this.rForm.get('invoiceLines');
  // }

  // get InvoiceTotal(){
  //   return this.rForm.get('invoiceTotal.current');
  // }
  
  // initData(formValue: IInvoiceLine[]){
  //   this.data=<IInvoiceTotal>{
  //     total_netto:0,
  //     total_tax:0,
  //     total_brutto:0
  //   };
  //   formValue.forEach((el:IInvoiceLine)=>{
  //     this.data.total_netto+=(el.netto_value);
  //     this.data.total_tax+=(el.vat_value);
  //   });

  //    this.data.total_netto=Math.round(this.data.total_netto*100)/100;
  //    this.data.total_tax=Math.round(this.data.total_tax*100)/100;
  //    this.data.total_brutto=Math.round((this.data.total_netto+this.data.total_tax)*100)/100;
  //    this.InvoiceTotal.patchValue(this.data);
  // }
}
