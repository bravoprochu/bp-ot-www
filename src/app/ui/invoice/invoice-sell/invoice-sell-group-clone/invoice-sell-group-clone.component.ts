import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoiceSellService } from '../services/invoice-sell.service';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { MomentCommonService } from '@bpShared/moment-common/moment-common.service';
import { IInvoiceSellLineList } from '@bpUI/invoice/interfaces/i-invoice-line-list';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormGroup, FormControl } from '@angular/forms';
import { IInvoiceSellGroupClone } from '@bpUI/invoice/interfaces/i-invoice-sell-group-clone';
import { DialogTakNieComponent } from '@bpShared/dialog-tak-nie/dialog-tak-nie.component';
import { MatDialog } from '@angular/material';
import { IDialogTakNieInfo } from '@bpCommonInterfaces/idialog-tak-nie-info';
import { ActivatedRoute } from '@angular/router';
import { empty, BehaviorSubject, Subject } from 'rxjs';
import {take, tap, switchMap, takeUntil, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-invoice-sell-group-clone',
  templateUrl: './invoice-sell-group-clone.component.html',
  styleUrls: ['./invoice-sell-group-clone.component.css']
})
export class InvoiceSellGroupCloneComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }





  constructor(
    private actRoute: ActivatedRoute,
    private df: InvoiceSellService,
    private cf: CommonFunctionsService,
    private dialogTakNie: MatDialog,
    private momentService: MomentCommonService,
  ) { }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.monthsAgo = new FormControl(1);
    this.initData();

  }

  isDestroyed$: Subject<boolean>;
  invoiceLine: FormGroup;
  invoiceList: IInvoiceSellLineList[] = [];
  invoiceListRest: IInvoiceSellLineList[] = [];
  isPending: boolean = true;
  productName = new FormControl(null);
  dateOfSell = new FormControl(this.momentService.getToday());
  dateOfIssue = new FormControl(this.momentService.getToday());
  monthsAgo: FormControl;
  


  copyToProductName(text: string)
  {
    this.productName.setValue(text);
  }



  drop(ev: CdkDragDrop<IInvoiceSellLineList[]>) {
    if (ev.previousContainer == ev.container) {
      moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
    } else {
      transferArrayItem(ev.previousContainer.data, ev.container.data, ev.previousIndex, ev.currentIndex);
    }
  }


  gapIfEmpty():number
  {
    return this.invoiceListRest.length>0 ? 0:30;
  }

  save(invoiceList: IInvoiceSellLineList[]) {
    let dataToPost = {
      dateOfIssue: this.dateOfIssue.value,
      dateOfSell: this.dateOfSell.value,
      invoiceList: invoiceList,
      productName: this.productName.value
    } as IInvoiceSellGroupClone;

    this.isPending=true;

    this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: "Faktura sprzedaży, klonowanie grupowe", question: `Czy na pewno utworzyć klony ${invoiceList.length} faktur ?` } })
      .afterClosed()
      .pipe(
        switchMap(dialogResponse => {
          this.cf.toastMake("Zapisuję dane", 'navDelete', this.actRoute);
          if(dialogResponse){
            return this.df.postInvoiceListToClone(dataToPost)
          }
          this.isPending=false;
          return empty();        
        }),
        take(1)      
        )
      .subscribe(s => {
        this.cf.toastMake(`Utworzono clony dokumentów.. UWAGA: Lista faktur w tabeli nie aktualizuje się automatycznie`, "save", this.actRoute);
        this.isPending=false;
      });
  }


  flexSize():number{
   
    return (this.invoiceList.length>0 && this.invoiceListRest.length>0) ? 50:25;
  }

  getMonthAgo():string {
    return this.monthsAgo.value ? this.momentService.getToday().subtract(this.monthsAgo.value, "month").format("MMMM"):  "wprowadź wartość: ile miesięcy temu..";
  }


  initData() {
    this.monthsAgo.valueChanges.pipe(
      startWith(1),
      takeUntil(this.isDestroyed$),
      switchMap(_monthsAgo=>{
        if(!_monthsAgo) {return empty();}
          return  this.df.getLastMonthInvoices(this.monthsAgo.value).pipe(
            take(1)
          )
      }),
    )
      .subscribe(
        (_data: any) => {
          this.invoiceList = _data;
          this.isPending = false;
        },
      )
  }

}
