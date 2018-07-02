import { IEmployee } from '../../../shared/interfaces/iemployee';
import { RuleFailurePosition } from 'tslint/lib';
import { LoadBuyComponent } from '../load-buy/load-buy.component';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ILoadingPlace } from '../../../shared/interfaces/iloading-place';
import { ILoad, ILoadRoute, ILoadRoutePallete, IPallet } from '../../../shared/interfaces/iload';
import { IAddress } from '../../../shared/interfaces/iaddress';
import { IOrderTransEuRequirements } from '../../../shared/interfaces/i-order-trans-eu-requirements';
import { IOrderTransEuLoad } from '../../../shared/interfaces/i-order-trans-eu-load';
import { IOrderTransEuPaymentPrice } from '../../../shared/interfaces/i-order-trans-eu-payment-price';
import { IOrderTransEuPayment } from '../../../shared/interfaces/i-order-trans-eu-payment';
import { IOrderTransEu } from '../../../shared/interfaces/i-order-trans-eu';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IDetailObj } from "app/shared/idetail-obj";
import { ITitle } from "app/shared/ititle";
import { IBasicActions } from "app/shared/ibasic-actions";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { IGeo } from "app/shared/interfaces/igeo";
import * as moment from 'moment';
import { IValueViewValue } from "app/shared/interfaces/ivalue-view-value";
import { ILoadBuy, IContactPerson, IIdValue } from "app/shared/interfaces/iload";
import { MatSelect } from '@angular/material';
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { LoadService } from 'app/ui/loads/services/load.service';
import {saveAs} from "file-saver"
import { Subject } from 'rxjs';




@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit, OnDestroy, AfterViewInit, IDetailObj {

  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.complete(); this.isDestroyed$.unsubscribe();
  }
  @ViewChild('loadBuy') loadBuy:LoadBuyComponent;
    
  constructor (
    public fb:FormBuilder,
    private actRoute: ActivatedRoute,
    private df: LoadService,
    private cf: CommonFunctionsService
  ){}

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initRouteId();
    this.initForm();
    this.initData();
  }

  dataObj:any;
  
  isDestroyed$:Subject<boolean>;
  isPending: boolean=true;
  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      subtitle: "szczegóły, edycja",
      title: "Ładunek"
    },
    basicActions: {

    }
  };
  deficyt:number;
  rForm: FormGroup ;
  routeId: number;

    
  get buy():FormGroup
  {
    return <FormGroup>this.rForm.get('buy');
  }

  get buyId():FormControl
  {
    return <FormControl>this.rForm.get('buy.loadBuyId');
  }
  get buyingInfoPrice()
  {
    return this.rForm.get('buy.buying_info.price');
  }

  get creationInfo():FormControl
  {
    return <FormControl>this.rForm.get('creationInfo');
  }
  get isTransEu():boolean
  {
    return this.rForm.value.transEu;
  }

  get isSell():boolean
  {
    return this.rForm.value.sell.loadSellId;
  }

  
   get isSellInvoiceSell():boolean
  {
    return this.rForm.value.sell;
  } 

  get loadExtraInfo():FormGroup
  {
  return <FormGroup>this.rForm.get('loadExtraInfo');
  }

  get sell():FormGroup
  {
    return <FormGroup>this.rForm.get('sell');
  }

  get sellingInfoPrice()
  {
    return this.rForm.get('sell.selling_info.price');
  }


  get transEu():FormGroup
  {
    return <FormGroup>this.rForm.get('transEu');    
  }

  get buyingPrice(){
    return this.rForm.get('buy.buying_info.price');
  }

 
  initForm(): void
  {
    this.rForm=this.cf.formLoadGroup(this.fb, this.isDestroyed$);
  }

  initRouteId(): void 
  {
    this.actRoute.paramMap
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      this.routeId=+s.get('id');
    })
  }

  initData(): void 
  {
    if(this.routeId>0){
      this.df.getById(this.routeId)
      .take(1)
      .subscribe((s:ILoad)=>{
        this.cf.toastMake(`Pobrano dane ${s.loadNo} [id: ${s.loadId}]`, "initData", this.actRoute);
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
        this.isPending=false;
      });      
    } else {
      // let data=<ILoad>JSON.parse('{"buy":{"buying_info":{"company":{"addressList":[{"addressId":2,"address_type":"główny","country":"PL","postal_code":"42-200","locality":"Częstochowa","street_address":"Dmowskiego","street_number":"1 a"}],"bankAccountList":[],"companyId":2,"short_name":"ZW Kompleks","legal_name":"Zakład Wielobranżowy KOMPLEKS Sp. J. Rafał Magiera i Jan Zrostek","vat_id":"PL5730004591","telephone":"(48) 343410168","fax":"","email":"kompleks@post.pl","url":"http://kompleks-transport.pl","employeeList":[{"companyEmployeeId":4,"given_name":"Rafał","family_name":"Magiera","trans_id":"78784-1","email":"rafal.magiera@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":5,"given_name":"Jan","family_name":"Zrostek","trans_id":"78784-2","email":"kompleks@post.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":6,"given_name":"Magdalena","family_name":"Kowalska","trans_id":"78784-3","email":"m.lipka@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":7,"given_name":"Arkadiusz","family_name":"Bieniek","trans_id":"78784-4","email":"a.bieniek@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":8,"given_name":"Maciej","family_name":"Różycki","trans_id":"78784-5","email":"m.rozycki@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":9,"given_name":"Monika","family_name":"Król","trans_id":"78784-7","email":"m.szymczynska@kompleks-transport.pl","telephone":null,"is_driver":false}],"trans_id":78784},"date":"2017-11-13","price":{"price":150,"currency":{"currencyId":26,"name":"EUR","description":"euro"},"rate_date":"2017-11-13","rate":4.2352,"pln_value":635.28},"paymentTerms":{"day0":"2017-11-13","description":null,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":"2018-01-04","paymentDays":52}},"load_info":{"description":null,"load_height":1.3,"load_length":5.2,"load_volume":12.7,"load_weight":0.72,"extraInfo":{"is_ltl":true,"is_lift_required":true,"is_truck_crane_required":null,"is_tir_cable_required":true,"is_tracking_system_required":true,"is_for_clearence":false,"required_ways_of_loading":[{"viewValueDictionaryId":47,"viewValue":"tyłem","viewValueGroupNameId":1,"value":"back"},{"viewValueDictionaryId":61,"viewValue":"bokiem","viewValueGroupNameId":1,"value":"side"}],"required_adr_classes":[{"viewValueDictionaryId":40,"viewValue":"Materiały trujące","viewValueGroupNameId":2,"value":"6.1"},{"viewValueDictionaryId":42,"viewValue":"Materiały promieniotwórcze","viewValueGroupNameId":2,"value":"7"},{"viewValueDictionaryId":43,"viewValue":"Materiały żrące","viewValueGroupNameId":2,"value":"8"}],"required_truck_body":{"viewValueDictionaryId":5,"viewValue":"kontener 20/40","viewValueGroupNameId":3,"value":"container-20-40"},"type_of_load":{"viewValueDictionaryId":27,"viewValue":"beczka","viewValueGroupNameId":4,"value":"barrel"}}},"routes":[{"loading_date":"2017-10-23T10:15","loading_type":"Załadunek","address":{"addressId":0,"address_type":"główny","country":"PL","postal_code":"61-608","locality":"Poznań","street_address":"Bolka","street_number":"2/81"},"geo":{"latitude":null,"longitude":null},"info":"kiepski dojazd","pallets":[{"type":"EURO","dimmension":null,"amount":3,"is_stackable":null,"is_exchangeable":null,"info":null}]},{"loading_date":"2017-10-23T12:00","loading_type":"Załadunek","address":{"addressId":0,"address_type":"główny","country":"PL","postal_code":"62-098","locality":"Koziegłowy","street_address":"Końcowa","street_number":"50"},"geo":{"latitude":null,"longitude":null},"info":null,"pallets":[{"type":"EURO","dimmension":null,"amount":3,"is_stackable":null,"is_exchangeable":null,"info":null},{"type":"Other","dimmension":"120x160","amount":3,"is_stackable":true,"is_exchangeable":true,"info":"ok, uwazaj"},{"type":"Other","dimmension":"120x120","amount":2,"is_stackable":true,"is_exchangeable":true,"info":null}]},{"loading_date":"2017-10-24T16:00","loading_type":"Rozładunek","address":{"addressId":0,"address_type":"główny","country":"PL","postal_code":"62-095","locality":"Murowana Goślina","street_address":"Źródlana","street_number":"23"},"geo":{"latitude":null,"longitude":null},"info":null,"pallets":[{"type":"EURO","dimmension":null,"amount":5,"is_stackable":null,"is_exchangeable":null,"info":null}]},{"loading_date":"2017-10-24T18:00","loading_type":"Rozładunek","address":{"addressId":0,"address_type":"główny","country":"PL","postal_code":"64-608","locality":"Oborniki","street_address":"Nowa","street_number":"13"},"geo":{"latitude":null,"longitude":null},"info":"wyjebka pl","pallets":[{"type":"EURO","dimmension":null,"amount":3,"is_stackable":null,"is_exchangeable":null,"info":null}]}]},"info":null,"loadNo":"12/10/2017","loadId":null,"sell":{"selling_info":{"company":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"date":"2017-11-13","price":{"price":null,"currency":{"currencyId":null,"name":null,"description":null},"rate_date":"2017-11-13","rate":null,"pln_value":0},"paymentTerms":{"day0":"2017-11-13","description":null,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":null,"paymentDays":60}},"principal":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"contact_persons_list":[]},"transEu":{"loadTransEuId":null,"contactPersonsList":[],"price":{"price":null,"currency":{"currencyId":null,"name":null,"description":null},"rate_date":"2017-11-13","rate":null,"pln_value":0},"sellingCompany":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"transEuId":null}}');
      let data=<ILoad>JSON.parse('{"buy":{"loadBuyId":null,"buying_info":{"company":{"addressList":[{"addressId":2,"address_type":"główny","country":"PL","postal_code":"42-200","locality":"Częstochowa","street_address":"Dmowskiego","street_number":"1 a"}],"bankAccountList":[],"companyId":2,"short_name":"ZW Kompleks","legal_name":"Zakład Wielobranżowy KOMPLEKS Sp. J. Rafał Magiera i Jan Zrostek","vat_id":"PL5730004591","telephone":"(48) 343410168","fax":"","email":"kompleks@post.pl","url":"http://kompleks-transport.pl","employeeList":[{"companyEmployeeId":4,"given_name":"Rafał","family_name":"Magiera","trans_id":"78784-1","email":"rafal.magiera@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":5,"given_name":"Jan","family_name":"Zrostek","trans_id":"78784-2","email":"kompleks@post.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":6,"given_name":"Magdalena","family_name":"Kowalska","trans_id":"78784-3","email":"m.lipka@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":7,"given_name":"Arkadiusz","family_name":"Bieniek","trans_id":"78784-4","email":"a.bieniek@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":8,"given_name":"Maciej","family_name":"Różycki","trans_id":"78784-5","email":"m.rozycki@kompleks-transport.pl","telephone":"(48) 343410168","is_driver":false},{"companyEmployeeId":9,"given_name":"Monika","family_name":"Król","trans_id":"78784-7","email":"m.szymczynska@kompleks-transport.pl","telephone":null,"is_driver":false}],"trans_id":78784},"date":"2017-11-15","price":{"price":75,"currency":{"currencyId":26,"name":"EUR","description":"euro"},"rate_date":"2017-11-15","rate":4.2487,"pln_value":318.65},"paymentTerms":{"day0":"2017-11-15","description":null,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":"2018-01-14","paymentDays":60}},"load_info":{"description":null,"load_height":null,"load_length":null,"load_volume":null,"load_weight":0.7,"extraInfo":{"is_ltl":null,"is_lift_required":null,"is_truck_crane_required":null,"is_tir_cable_required":null,"is_tracking_system_required":null,"is_for_clearence":null,"required_ways_of_loading":null,"required_adr_classes":null,"required_truck_body":{"viewValueDictionaryId":53,"viewValue":"laweta","viewValueGroupNameId":3,"value":"car-transporter"},"type_of_load":null}},"routes":[{"loadRouteId":null,"loading_date":"2017-11-15T21:06","loading_type":"Załadunek","address":{"addressId":0,"address_type":"główny","country":"PL","postal_code":"62-085","locality":"Wrocław","street_address":"Wielka","street_number":"2"},"geo":{"latitude":null,"longitude":null},"info":null,"pallets":[{"loadRoutePalletId":null,"type":{"viewValueDictionaryId":46,"value":"euro","viewValue":"EURO","viewValueGroupNameId":5},"dimmension":null,"amount":3,"is_stackable":null,"is_exchangeable":null,"info":null},{"loadRoutePalletId":null,"type":{"viewValueDictionaryId":62,"value":"other","viewValue":"Inne","viewValueGroupNameId":5},"dimmension":"120x120x","amount":4,"is_stackable":false,"is_exchangeable":true,"info":null}]},{"loadRouteId":null,"loading_date":"2017-11-15T23:00","loading_type":"Rozładunek","address":{"addressId":0,"address_type":"sklep","country":"PL","postal_code":"65-700","locality":"Kalisz","street_address":"Szkolna","street_number":"17/5"},"geo":{"latitude":null,"longitude":null},"info":"gówniany wjazd","pallets":[]}]},"loadExtraInfo":{"cmrName":null,"cmrRecived":null,"cmrRecivedDate":null,"invoiceBuyId":null,"invoiceBuyNo":null,"invoiceSellId":null,"invoiceSellNo":null,"invoiceSent":null,"invoiceSentNo":null,"invoiceRecivedDate":null,"is_load_no":false,"is_in_words":false,"is_tax_nbp_exchanged":false,"load_no":null,"tax_exchanged_info":null,"total_brutto_in_words":null},"invoiceSellNo":"brak fv","info":null,"loadNo":null,"loadId":null,"sell":{"loadSellId":null,"selling_info":{"company":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"date":"2017-11-15","price":{"price":null,"currency":{"currencyId":null,"name":null,"description":null},"rate_date":"2017-11-15","rate":null,"pln_value":0},"paymentTerms":{"day0":"2017-11-15","description":null,"paymentTerm":{"paymentTermId":3,"name":"przelew","isDescription":false,"isPaymentDate":true},"paymentDate":"2018-01-14","paymentDays":60}},"principal":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"contactPersonsList":[]},"transEu":{"loadTransEuId":null,"contactPersonsList":[],"price":{"price":null,"currency":{"currencyId":null,"name":null,"description":null},"rate_date":"2017-11-15","rate":null,"pln_value":0},"sellingCompany":{"addressList":[],"bankAccountList":[],"companyId":0,"short_name":null,"legal_name":"","vat_id":null,"telephone":null,"fax":"","email":null,"url":"","employeeList":[],"trans_id":null},"transEuId":null}}');
      //this.cf.patchLoad(data,this.rForm, this.fb,this.isAlive);
      this.isPending=false;
    }
  }
  
  invoiceSellGen(){
    this.isPending=true;
    let id=this.rForm.value.loadId;
    this.df.loadInvoiceSellGen(id)
    .take(1)
    .switchMap(sw=>this.df.getById(id).take(1))
    .take(1)
    .subscribe(s=>{
      this.cf.toastMake(`Utworzono fakturę sprzedaży`, "invoiceSellGen", this.actRoute);
      this.cf.patchLoad(s,this.rForm, this.fb,this.isDestroyed$);
      this.isPending=false;
    });
  }

  public ngAfterViewInit(): void 
  {
    this.rForm.valueChanges
    .delay(1000)
    .debounceTime(1000)
    .takeWhile(()=>this.isDestroyed$ && this.rForm.value.sell)
    .subscribe(s=>{
      if(this.rForm.valid){
      }
    });
  }

  formUpdate()
  {
    this.rForm.markAsDirty();
    
  }

  navGetCode():void
  {
    console.log(JSON.stringify(this.rForm.value));
  }

  navCancel(): void {
  }
  navDownload(): void {
    throw new Error("Method not implemented.");
  }
  navDelete(): void {
    throw new Error("Method not implemented.");
  }
  navSave(): void 
  {
  }

  offerGenPdf(){
    this.df.genPdf(this.rForm.value)
    .map(res=>{
      return new Blob([res, 'application/pdf'], {type: 'application/pdf'});
    })
    .takeUntil(this.isDestroyed$)
    .subscribe(s=>{
      saveAs(s, 'Zlecenie przewozowe nr '+this.rForm.get('loadNo').value+'.pdf');
    })
  }




}