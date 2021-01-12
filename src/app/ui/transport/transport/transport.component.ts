import { ITransportOffer } from '../interfaces/itransport-offer';
import { FormBuilder, FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDetailObj } from 'app/shared/idetail-obj';
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { CommonFunctionsService } from 'app/services/common-functions.service';
import { FormGroup } from '@angular/forms/src/model';
import { TransportService } from 'app/ui/transport/services/transport.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogTakNieComponent } from 'app/shared/dialog-tak-nie/dialog-tak-nie.component';
import { IDialogTakNieInfo } from 'app/shared/interfaces/idialog-tak-nie-info';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { ICurrency } from '@bpShared/currency/interfaces/i-currency';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.css']
})
export class TransportComponent implements OnInit, OnDestroy, IDetailObj {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();;
  }

  constructor(
    private actRoute: ActivatedRoute,
    private cf: CommonFunctionsService,
    private df: TransportService,
    private dialogTakNie: MatDialog,
    public fb: FormBuilder,
    private router: Router

  ) {
    this.fb = new FormBuilder();
  }

  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    basicActions: {},
    title: {
      subtitle: "Tworzenie, edycja zleceń transportowych",
      title: "Transport"
    }
  };
  rForm: FormGroup;
  routeId: number;

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initRouteId();
    this.initForm();
    this.initData();
  }



  get company(): FormGroup {
    return <FormGroup>this.rForm.get('tradeInfo.company');
  }

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get('creationInfo');
  }

  get currency(): FormControl {
    return <FormControl>this.rForm.get('tradeInfo.price.currency');
  }

  get id(): FormControl {
    return <FormControl>this.rForm.get('transportOfferId');
  }

  get invoiceInPLN(): FormControl {
    
    return <FormControl>this.rForm.get('invoiceInPLN');
  }
  
  get invoiceSellId(): FormControl {
    
    return <FormControl>this.rForm.get('invoiceSellId');
  }

  get invoiceSellNo(): FormControl {
    return <FormControl>this.rForm.get('invoiceSellNo');
  }



  get load(): FormGroup {
    return <FormGroup>this.rForm.get('load');
  }

   get loadDate(): FormControl {
    return <FormControl>this.rForm.get('load.date');
  } 

  get offerNo(): FormControl {
    return <FormControl>this.rForm.get('offerNo');
  } 

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get('tradeInfo.paymentTerms');
  }

  get price(): FormGroup {
    return <FormGroup>this.rForm.get('tradeInfo.price');
  }

  get tradeInfo(): FormGroup {
    return <FormGroup>this.rForm.get('tradeInfo');
  }

  get unload(): FormGroup {
    return <FormGroup>this.rForm.get('unload');
  }
  get unloadPlace(): FormControl {
    return <FormControl>this.rForm.get('unload.locality');
  }
   get unloadDate(): FormControl {
    return <FormControl>this.rForm.get('unload.date');
  } 

  initForm(): void {
    this.rForm = this.cf.formTransportGroup(this.fb, this.isDestroyed$);
  }
  
  initRouteId(): void {
    this.actRoute.paramMap
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.routeId = +s.get('id');
      })
  }
  initData(): void {
    if (this.routeId > 0) {
      this.navDetailInfo.basicActions.canDelete=true;
      this.df.getById(this.routeId)
        .take(1)
        .subscribe((data:ITransportOffer) => {
          this.cf.toastMake(`Pobrano dane ${data.offerNo}, [id: ${data.transportOfferId}]`,"initData", this.actRoute);
          this.cf.patchTransport(data, this.rForm, this.fb, this.isDestroyed$);
          this.rForm.markAsPristine();
        });

    } else {
        //let data=<ITransportOffer>JSON.parse('{"transportOfferId":null,"info":null,"offerNo":"149250/O/2017","tradeInfo":{"company":{"addressList":[{"addressId":304,"address_type":"główny","country":"PL","postal_code":"01-616","locality":"Warszawa","street_address":"Mickiewicza ","street_number":"36 A"}],"bankAccountList":[],"companyId":6,"short_name":"Optima","legal_name":"Optima Logistics Group Sp. z o.o.","vat_id":"PL7010157936","telephone":"(48) 222428445","fax":"","email":"biuro@optimalg.com","url":"http://optimalg.com","employeeList":[{"companyEmployeeId":33,"given_name":"Paulina","family_name":"Goruch","trans_id":"308344-132","email":"pgoruch@optimalg.com","telephone":"(48) 222501402","is_driver":false},{"companyEmployeeId":34,"given_name":"Michał","family_name":"Nowak","trans_id":"308344-130","email":"mnowak@optimalg.com","telephone":"(48) 223909106","is_driver":false},{"companyEmployeeId":35,"given_name":"Agnieszka","family_name":"Wierbol","trans_id":"308344-124","email":"awierbol@optimalg.com","telephone":"(48) 223797364","is_driver":false},{"companyEmployeeId":36,"given_name":"Piotr","family_name":"Dzierżanowski","trans_id":"308344-120","email":"pdzierzanowski@optimalg.com","telephone":"(48) 223790307","is_driver":false},{"companyEmployeeId":37,"given_name":"Łukasz","family_name":"Tywonek","trans_id":"308344-119","email":"ltywonek@optimalg.com","telephone":"(48) 223797052","is_driver":false},{"companyEmployeeId":38,"given_name":"Jakub","family_name":"Michalski","trans_id":"308344-117","email":"jmichalski@optimalg.com","telephone":"(48) 223797674","is_driver":false},{"companyEmployeeId":39,"given_name":"Michał","family_name":"Zwęgliński","trans_id":"308344-113","email":"mzweglinski@optimalg.com","telephone":"(48) 223797682","is_driver":false},{"companyEmployeeId":40,"given_name":"Sylwia","family_name":"Nawrot","trans_id":"308344-112","email":"snawrot@optimalg.com","telephone":"(48) 222578712","is_driver":false},{"companyEmployeeId":41,"given_name":"Mariusz","family_name":"Banasik","trans_id":"308344-104","email":"mbanasik@optimalg.com","telephone":"(48) 223797622","is_driver":false},{"companyEmployeeId":42,"given_name":"Piotr","family_name":"Kocyk","trans_id":"308344-103","email":"pkocyk@optimalg.com","telephone":"(48) 222501483","is_driver":false},{"companyEmployeeId":43,"given_name":"Sebastian","family_name":"Purtak","trans_id":"308344-102","email":"spurtak@optimalg.com","telephone":"(48) 223797106","is_driver":false},{"companyEmployeeId":44,"given_name":"Filip","family_name":"Dahkour","trans_id":"308344-97","email":"fdahkour@optimalg.com","telephone":"(48) 222502784","is_driver":false},{"companyEmployeeId":45,"given_name":"Jacek","family_name":"Misiński","trans_id":"308344-82","email":"jmisinski@optimalg.com","telephone":"(48) 223792543","is_driver":false},{"companyEmployeeId":46,"given_name":"Mateusz","family_name":"Korytkowski","trans_id":"308344-78","email":"mkorytkowski@optimalg.com","telephone":"(48) 222502993","is_driver":false},{"companyEmployeeId":47,"given_name":"Aleksandra","family_name":"Rybińska","trans_id":"308344-73","email":"arybinska@optimalg.com","telephone":"(48) 222502268","is_driver":false},{"companyEmployeeId":48,"given_name":"Sylwia","family_name":"Mikulska","trans_id":"308344-67","email":"spasnikowska@optimalg.com","telephone":"(48) 222502659","is_driver":false},{"companyEmployeeId":49,"given_name":"Piotr","family_name":"Plewka","trans_id":"308344-64","email":"pplewka@optimalg.com","telephone":"(48) 222501816","is_driver":false},{"companyEmployeeId":50,"given_name":"Marcin","family_name":"Ulas","trans_id":"308344-56","email":"mulas@optimalg.com","telephone":"(48) 223797715","is_driver":false},{"companyEmployeeId":51,"given_name":"Piotr","family_name":"Golacik","trans_id":"308344-55","email":"pgolacik@optimalg.com","telephone":"(48) 221881698","is_driver":false},{"companyEmployeeId":52,"given_name":"Konrad","family_name":"Kwiatkowski","trans_id":"308344-50","email":"kkwiatkowski@optimalg.com","telephone":"(48) 222501578","is_driver":false},{"companyEmployeeId":53,"given_name":"Paulina","family_name":"Karolik","trans_id":"308344-45","email":"pkarolik@optimalg.com","telephone":"(48) 222501574","is_driver":false},{"companyEmployeeId":54,"given_name":"Agnieszka","family_name":"Rześna","trans_id":"308344-25","email":"biuro@optimalg.com","telephone":null,"is_driver":false},{"companyEmployeeId":55,"given_name":"Iwona","family_name":"Kopczyńska","trans_id":"308344-1","email":"biuro@optimalg.com","telephone":null,"is_driver":false},{"companyEmployeeId":56,"given_name":"Piotr","family_name":"Pyrak","trans_id":"308344-137","email":"ppyrak@optimalg.com","telephone":"(48) 221120176","is_driver":false},{"companyEmployeeId":57,"given_name":"Edyta","family_name":"Herda","trans_id":"308344-142","email":"eherda@optimalg.com","telephone":"(48) 223783697","is_driver":false}],"trans_id":308344},"date":"2017-11-21","price":{"price":250,"currency":{"currencyId":26,"name":"EUR","description":"EURO"},"rate_date":"2017-11-20","rate":4.2351,"pln_value":1058.78},"paymentTerms":{"day0":"2017-11-21","description":null,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":"2018-01-20","paymentDays":60}},"load":{"date":"2017-11-20T11:00","postalCode":"DE 90562","locality":"Heroldsberg"},"unload":{"date":"2017-11-20T15:00","postalCode":"CZ 250 01","locality":"Brandys nad Labem"}}');
        // this.cf.patchTransport(data, this.rForm, this.fb, this.isAlive);
      this.loadDate.patchValue(this.cf.getNextHour());
      this.unloadDate.patchValue(this.cf.getNextHour(2));
    }
  }


  invoiceSellGen() {
    if (!this.id.value) { return; }
    let id = this.id.value;
    let actCurr: ICurrency= <ICurrency>this.currency.value;

    if (!this.invoiceSellId.value) {
      this.isPending = true;
      //let inPLN=this.invoiceInPLN.value==true ? "FAKTURA BĘDZIE WYSTAWIONA W PLN" : `FAKTURA BĘDZIE WYSTAWIONA W ${this.currency.get('name').value}`;
      this.dialogTakNie
        .open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{question: `Czy na pewno potwierdzić dostarczenie ładunku do ${this.unloadPlace.value} ? (automatycznie zostanie utworzona faktura sprzedaży)`, title: "Transport - potwierdzenie dostarczenia"} })
        .afterClosed()
        .switchMap(czyPLN=>{
          if(czyPLN){
            if(actCurr.name=="PLN"){
              return Observable.of(true);
            } else{
              return this.dialogTakNie.open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{title: "Waluta faktury", question: `UWAGA, sprawdź regulamin zlecenia.  Zlecenie jest w ${actCurr.description}, czy faktura ma być przeliczona i wystawiona w walucie PLN ?`}}).afterClosed()
            }
          } else {
            this.isPending=false;
            return Observable.empty();
          }
        })
        .switchMap(sw=>{
          this.cf.toastMake("Generuję fakturę sprzedaży", "Transport - potwierdzenie", this.actRoute)  
          if(sw){
            return this.df.invoiceSellGen(id, true);
          } else {
            return this.df.invoiceSellGen(id, false);
          }
        })
        .switchMap(sw=>this.df.getById(id).take(1))
        .do(d=>this.cf.toastMake("Pobieram zaktualizowane dane", "Transport - potwierdzenie", this.actRoute)  )
        .take(1)
        .subscribe(s=>{
          this.isPending=false;
          this.cf.patchTransport(s, this.rForm, this.fb, this.isDestroyed$)
          // this.isPending=false;
        });
    }
  }

  navCancel(): void {
    throw new Error("Method not implemented.");
  }
  navDownload(): void {
    throw new Error("Method not implemented.");
  }
  navDelete(): void {
    if(this.id.value ==null) {return;}
    
    this.dialogTakNie.open(DialogTakNieComponent, {data: <IDialogTakNieInfo>{title: "Zlecenia transportowe", question: "Czy na pewno chcesz usunąć to zlecenie, dane zostaną całkowicie usunięte z serwera ?"}})
    .afterClosed()
    .switchMap(sw=>{
      if(sw){
        this.cf.toastMake(`Trwa usuwanie zlecenia transportowego ${this.offerNo.value}`, 'navDelete', this.actRoute);
        return this.df.delete(this.id.value);
      }else{
        return Observable.empty()
      }
    })
    .take(1)
    .subscribe(s=>{
      if(s!=null){
        this.cf.toastMake(s["info"],"navDelete", this.actRoute);
      } else {
      this.cf.toastMake(`Usunięto dane`,"navDelete", this.actRoute);
      this.router.navigate(['transport']);
      }
    })
  }


  navSave(): void {
    this.isPending = true;
    let id = this.rForm.value.transportOfferId == null ? 0 : this.rForm.value.transportOfferId;
    let d:moment.Moment= this.rForm.value.tradeInfo.date;
    
    
    this.df.update(id, this.rForm.value)
      .takeUntil(this.isDestroyed$)
      .take(1)
      .switchMap(sw => {
        this.cf.toastMake(`Aktualizuje dane`,"navSave", this.actRoute);
        return this.df.getById(id)
        .take(1);
      })
      .subscribe(s => {
        this.cf.toastMake(`Pobrano zaktualizowane dane ${s.offerNo}, [id: ${s.transportOfferId}]`,"navSave", this.actRoute);
        this.cf.patchTransport(s, this.rForm, this.fb, this.isDestroyed$);
        this.isPending = false;
        this.rForm.markAsPristine();
      })
  }

}
