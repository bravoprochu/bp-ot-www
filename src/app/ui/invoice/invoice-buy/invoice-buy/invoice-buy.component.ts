import { InvoiceBuyService } from '../services/invoice-buy.service';
import { DialogTakNieComponent } from '../../../../shared/dialog-tak-nie/dialog-tak-nie.component';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CommonFunctionsService } from '../../../../services/common-functions.service';
import { IDetailObj } from '../../../../shared/idetail-obj';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IDialogTakNieInfo } from 'app/shared/interfaces/idialog-tak-nie-info';
import { Observable } from 'rxjs/Observable';
import { IInvoiceBuy } from '../../interfaces/iinvoice-buy';
import { InvoiceCommonFunctionsService } from '../../common/invoice-common-functions.service';
import { Subject } from 'rxjs';
import { CurrencyCommonService } from '@bpShared/currency/currency-common.service';
import { ICurrencyNbp } from '@bpShared/currency/interfaces/i-currency-nbp';
import { IPaymentTerms } from '@bpShared/payment-terms/i-payment-terms';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-sell-buy',
  templateUrl: './invoice-buy.component.html',
  styleUrls: ['./invoice-buy.component.css']
})
export class InvoiceBuyComponent implements OnInit, OnDestroy, IDetailObj {
  /**
   *
   */
  constructor(
    private cf: CommonFunctionsService,
    private currencyService: CurrencyCommonService,
    private icf: InvoiceCommonFunctionsService,
    private df: InvoiceBuyService,
    private dialogTakNie: MatDialog,
    public fb: FormBuilder,
    private router: Router,
    private actRoute: ActivatedRoute


  ) { }

  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }

  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      title: "Faktura zakupu",
    },
    basicActions: {
      canNotGoBack: false
    }
  };



  ngOnInit() {
    this.isPending = true;
    this.isDestroyed$ = new Subject<boolean>();
    this.initForm();
    this.initRouteId();
  }

  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  rForm: FormGroup;
  routeId: number;


  //#region getters

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get('creationInfo');
  }
  get companySeller(): FormGroup {
    return <FormGroup>this.rForm.get('companySeller');
  }
  get companySellerShortName(): FormControl {
    return <FormControl>this.rForm.get("companySeller.short_name");
  }

  get currency(): FormGroup {
    return <FormGroup>this.rForm.get('currency');
  }

  get dateOfIssue(): FormControl {
    return <FormControl>this.rForm.get("dateOfIssue");
  }

  get dateOfSell(): FormControl {
    return <FormControl>this.rForm.get("dateOfSell");
  }



  get isInvoiceReceived(): FormControl {
    return <FormControl>this.rForm.get("isInvoiceReceived");
  }

  get invoiceReceivedDate(): FormControl {
    return <FormControl>this.rForm.get("invoiceReceivedDate");
  }


  get invoiceLines(): FormArray {
    return (<FormArray>this.rForm.get('invoiceLines'));
  }

  get invoiceTotal(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal');
  }

  get invoiceTotalCurrent(): FormGroup {
    return <FormGroup>this.rForm.get('invoiceTotal.current');
  }

  get isCorrection(): FormControl {
    return <FormControl>this.rForm.get("isCorrection");
  }
  get paymentIsDone(): FormControl {
    return <FormControl>this.rForm.get("paymentIsDone");
  }


  get paymentDate(): FormControl {
    return <FormControl>this.rForm.get("paymentDate");
  }

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get('paymentTerms');
  }

  get paymentTermsDay0(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.day0");
  }
  get paymentTermsPaymentDays(): FormControl {
    return <FormControl>this.rForm.get("paymentTerms.paymentDays");
  }


  get rates(): FormArray {
    return <FormArray>this.rForm.get('rates');
  }

  //#endregion

  public initRouteId(): void {
    this.actRoute.paramMap
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.routeId = +s.get('id');
        this.initData();
      });

  }


  initData(): void {
    let id = this.routeId;
    if (id > 0) {
      this.df.getById(id)
        .takeUntil(this.isDestroyed$)
        .subscribe((s: IInvoiceBuy) => {
          this.cf.toastMake(`Pobrano dane: ${s.invoiceNo}`, "initData", this.actRoute);
          this.icf.patchInvoiceBuy(s, this.rForm, this.fb);
          this.navDetailInfo.basicActions.canDelete = true;
          this.isPending = false;
        });

    } else {
      this.isPending = false;
    }
  }


  navCancel(): void {
    throw new Error("Method not implemented.");
  }
  navDownload(): void {
    throw new Error("Method not implemented.");
  }
  public navDelete(): void {
    this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: "Faktura zakupu", question: `Czy na pewno usunąć dokument nr: ${this.rForm.value.invoiceNo} ? \n Dokumnet zostanie trwale usunięty z bazy bez możliwośći jego przywrcenia` } })
      .afterClosed()
      .switchMap(dialogResponse => {
        this.cf.toastMake("Usuwam dane", 'navDelete', this.actRoute);
        return dialogResponse ? this.df.delete(this.rForm.value.invoiceBuyId) : Observable.empty();
      })
      .take(1)
      .subscribe(s => {
        this.cf.toastMake("Usunięto dane", "init", this.actRoute);
        this.router.navigate(['/fakturaZakupu'])
      })
  }

  navSave(): void {
    //this.isPending=true;
    let id = this.rForm.value.invoiceBuyId ? this.rForm.value.invoiceBuyId : 0;
    this.df.update(id, this.rForm.value)
      .take(1)
      .switchMap((sw: IInvoiceBuy) => {
        this.cf.toastMake(`Zaktualizowano dane`, "navSave", this.actRoute);
        return this.df.getById(id)
      })
      .take(1)
      .subscribe((s: IInvoiceBuy) => {
        this.cf.toastMake(`Pobrano zaktualizowane dane ${s.invoiceNo}, [id: ${s.invoiceBuyId}]`, "navSave", this.actRoute);
        this.icf.patchInvoiceBuy(s, this.rForm, this.fb);
        this.isPending = false;
        this.rForm.markAsPristine();
      });
  }

  initForm(): void {
    this.rForm = this.icf.formInvoiceBuyGroup(this.fb, this.isDestroyed$);
    this.currency.setValue(this.currencyService.findCurrencyByName("pln"));
    this.paymentTermsPaymentDays.setValue(14, { emitEvent: true });
    this.invoicePosAdd();

    // this.invoiceLines.valueChanges
    //   .takeUntil(this.isDestroyed$)
    //   .debounceTime(2000)
    //   .switchMap(sw => {
    //     if (this.invoiceLines.valid) {
    //       return this.df.calcRates(this.rForm.value)
    //     } else {
    //       return Observable.empty();
    //     }
    //   })
    //   .map((s:any)=>{
    //     if (s == "error") {
    //       console.log('error');
    //     } else {
    //       let data = <IInvoiceBuy>s;
    //       this.icf.patchInvoiceRates(data.rates, this.rates, this.fb);
    //       this.icf.patchInvoiceTotal(data.invoiceTotal, this.invoiceTotal, this.fb);
    //     }
    //   })
    //   .subscribe();


    this.dateOfIssue
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.paymentTermsDay0.setValue(s, { emitEvent: true });
      })



    this.paymentIsDone.valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        if (s) {
          this.paymentDate.setValidators(Validators.required);
        } else {
          this.paymentDate.clearValidators();
        }
        this.paymentDate.updateValueAndValidity();
      });

    //checkbox if recived
    this.isInvoiceReceived
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        if (s) {
          this.invoiceReceivedDate.setValidators(Validators.required);
        } else {
          this.invoiceReceivedDate.clearValidators();
        }
        this.invoiceReceivedDate.updateValueAndValidity();
      })
  }


  invoiceLineUpdated(){
    this.df.calcRates(this.rForm.value).pipe(
      takeUntil(this.isDestroyed$),
      tap(()=>this.rForm.markAsDirty())
    )
    .subscribe(
      (_data:any)=>{
          this.icf.patchInvoiceRates(_data.rates, this.rates, this.fb);
          this.icf.patchInvoiceTotal(_data.invoiceTotal, this.invoiceTotal, this.fb);
      },
    )
    
  }

  invoicePosAdd() {
    this.icf.lineAdd(this.invoiceLines, this.fb);
  }
  invoicePosRemove(idx: number) {
    this.icf.lineRemove(idx, this.rForm, this.invoiceLines, this.isDestroyed$);
  }




}
