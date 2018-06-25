import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoiceBuyService } from 'app/ui/invoice/invoice-buy/services/invoice-buy.service';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { PaymentRemindDialogComponent } from 'app/ui/invoice/payment-remind-dialog/payment-remind-dialog.component';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { subscribeOn } from 'rxjs/operator/subscribeOn';

@Component({
  selector: 'app-invoice-buy-payment-remind',
  templateUrl: './invoice-buy-payment-remind.component.html',
  styleUrls: ['./invoice-buy-payment-remind.component.css']
})
export class InvoiceBuyPaymentRemindComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
  }

  constructor(
    private df: InvoiceBuyService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isDestroyed$=new Subject<boolean>();
    this.unpaidSearch$=new FormControl();
    this.notConfirmedSearch$=new FormControl();
    this.initData();
    this.initForm();
  }


  isDestroyed$: Subject<boolean>;
  
  unpaid:any[];
  unpaidFilterInfo:string;
  unpaidFiltered: any[];
  unpaidSearch$:FormControl;
  unpaidStats:any[];
  
  notConfirmed: any[];
  notConfirmedFiltered: any[];
  notConfirmedFilterInfo: string;
  notConfirmedSearch$: FormControl;
  notConfirmedStats: any[];
    


  initData()
  {
    this.df.paymentRemind()
    .take(1)
    .map(s=>{
      this.unpaid=s["unpaid"];
      this.unpaidFiltered=s["unpaid"];
      this.unpaidStats=s["unpaidStats"];
      this.notConfirmed=s["notConfirmed"];
      this.notConfirmedFiltered=s["notConfirmed"];
      this.notConfirmedStats=s["notConfirmedStats"];
      return s;
    })
    .subscribe();
  }

  initForm()
  {
    this.unpaidSearch$
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s=>{
        this.unpaidFiltered=this.filterArr(s, this.unpaid);
        this.unpaidFilterInfo=s.length>0 ? `Zastosowano filtr, znaleziono: ${this.unpaidFiltered.length}`: "";
      });

      this.notConfirmedSearch$
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s=>{
        this.notConfirmedFiltered=this.filterArr(s, this.notConfirmed);
        this.notConfirmedFilterInfo=s.length>0 ? `Zastosowano filtr, znaleziono: ${this.notConfirmedFiltered.length}`: "";
      })
    
  }

  checkAsPaid(payment: any):void
  {
    let idx=this.unpaid.indexOf(payment);
    this.dialog.open(PaymentRemindDialogComponent, {data: 
      {
        title: payment["company"]["shortName"], 
        price: payment["invoiceTotal"]["total_brutto"],
        currency: payment["currency"]["name"]
      }
      })
    .afterClosed()
    .switchMap(sw=>{
      if(sw!==undefined){
        let pDate=sw.substring(0,10);
        return this.df.paymentConfirmation(payment["invoiceSellId"], pDate);
      }else{
        return Observable.empty();
      }
    })
    .take(1)
    .subscribe(s=>{
      this.unpaid.splice(this.unpaid.indexOf(payment),1);
    })

  }

  filterArr(str: string, arr:any[]):any[]
  {
    if(arr==undefined || arr.length==0 || str==undefined) {
      return [];
    }
    str.toLowerCase();
    return arr.filter((f)=>{
      let address=(f["company"]["address"]).toLowerCase();
      let vat=f["company"]["vatId"];
      let contact=(f["company"]["contact"]).toLowerCase();
      let shortName=(f["company"]["shortName"]).toLowerCase();
      let curr=(f["currency"]["name"]).toLowerCase();

      let res=address+vat+contact+shortName+curr;
      return res.includes(str);
    })
  }

}
