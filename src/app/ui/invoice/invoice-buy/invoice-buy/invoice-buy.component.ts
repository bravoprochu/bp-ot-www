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
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();
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
      //let data=<IInvoiceBuy>JSON.parse('{"invoiceBuyId":0,"currency":{"currencyId":36,"name":"PLN","description":"polski złoty"},"dateOfIssue":"2017-10-30","extraInfo":{"is_load_no":false,"is_in_words":false,"is_tax_nbp_exchanged":false,"load_no":null,"tax_exchanged_info":null,"total_brutto_in_words":null},"info":null,"invoiceNo":"FA 56226/2017","invoiceLines":[{"invoice_pos_id":0,"brutto_value":15.93,"name":"Papier do drukarki","measurement_unit":"szt.","netto_value":12.95,"pkwiu":null,"quantity":1,"unit_price":12.95,"vat_unit_value":2.98,"vat_value":2.98,"vat_rate":"23"}],"invoiceTotal.current":{"total_brutto":15.93,"total_netto":12.95,"total_tax":2.98},"paymentTerms":{"day0":"2017-10-30","description":null,"paymentTerms_Id":0,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":"2017-12-29","paymentDays":60},"rates":[{"rate_value_id":0,"brutto_value":15.93,"netto_value":12.95,"vat_rate":"23","vat_value":2.98}],"companySeller":{"addressList":[{"addressId":3,"address_type":"główny","country":"PL","postal_code":"77-200","locality":"Miastko","street_address":"Adama Mickiewicza ","street_number":"10/11"}],"bankAccountList":[],"companyId":3,"short_name":"Transeo","legal_name":"Transeo J.Skiba-Andrysiak, D. Trun s.c.","vat_id":"PL8421759229","telephone":"(48) 598221378","fax":"","email":"justyna-skiba@wp.pl","url":"http://www.transeo.net.pl","employeeList":[{"companyEmployeeId":29,"given_name":"Justyna","family_name":"Skiba-Andrysiak","trans_id":"403493-1","email":"justyna.skiba5@gmail.com","telephone":null,"is_driver":false},{"companyEmployeeId":30,"given_name":"Daniel","family_name":"Trun","trans_id":"403493-2","email":"daniel.trun@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":31,"given_name":"Ewa","family_name":"Gapińska","trans_id":"403493-4","email":"gapinskaewa@gmail.com","telephone":"(48) 672566716","is_driver":false},{"companyEmployeeId":32,"given_name":"Lidia","family_name":"Szysz","trans_id":"403493-7","email":"lidiaszysz@gmail.com","telephone":"(48) 790686866","is_driver":false},{"companyEmployeeId":33,"given_name":"Justyna","family_name":"Maciejczyk","trans_id":"403493-8","email":"justynamaciejczyk90@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":34,"given_name":"Adriana","family_name":"Miara","trans_id":"403493-9","email":"miara.ada@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":35,"given_name":"Michal","family_name":"Wirkus","trans_id":"403493-11","email":"spedytor.wirkus@gmail.com","telephone":"(48) 534964646","is_driver":false},{"companyEmployeeId":36,"given_name":"Jarosław","family_name":"Grudzień","trans_id":"403493-13","email":"jgrudzien.transeo@gmail.com","telephone":"(48) 731646767","is_driver":false},{"companyEmployeeId":37,"given_name":"Ola","family_name":"Zygowska","trans_id":"403493-14","email":"olatranseo@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":38,"given_name":"Ewa","family_name":"Kaczor","trans_id":"403493-15","email":"ewakaczor.transeo@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":39,"given_name":"Jacek","family_name":"Michalak","trans_id":"403493-16","email":"jacek.transeo@gmail.com","telephone":"(48) 598221378","is_driver":false},{"companyEmployeeId":40,"given_name":"Nicole","family_name":"Krzyżanowska","trans_id":"403493-17","email":"nicole.transeo1@gmail.com","telephone":"(48) 598221378","is_driver":false}],"trans_id":403493},"dateOfSell":"2017-10-30"}');
      //this.icf.patchInvoiceBuy(data, this.rForm, this.fb);
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
    this.paymentTermsPaymentDays.setValue(14, { emitEvent: false });


    this.invoiceLines.valueChanges
      .takeUntil(this.isDestroyed$)
      .debounceTime(2000)
      .switchMap(sw => {
        if (this.invoiceLines.valid) {
          return this.df.calcRates(this.rForm.value)
        } else {
          return Observable.empty();
        }
      })
      .map((s:any)=>{
        if (s == "error") {
          console.log('error');
        } else {
          let data = <IInvoiceBuy>s;
          this.icf.patchInvoiceRates(data.rates, this.rates, this.fb);
          this.icf.patchInvoiceTotal(data.invoiceTotal, this.invoiceTotal, this.fb);
        }
      })
      .subscribe();


    this.dateOfIssue
      .valueChanges
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        console.log(s);
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

  invoicePosAdd() {
    this.icf.lineAdd(this.invoiceLines, this.fb);
  }
  invoicePosRemove(idx: number) {
    this.icf.lineRemove(idx, this.rForm, this.invoiceLines, this.isDestroyed$);
  }




}
