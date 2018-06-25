import { ActivatedRoute } from '@angular/router';
import { LoadService } from '../services/load.service';
import { IDetailObj } from '../../../shared/idetail-obj';
import { last } from 'rxjs/operator/last';
import { IDialogTakNieInfo } from '../../../shared/interfaces/idialog-tak-nie-info';
import { DialogTakNieComponent } from '../../../shared/dialog-tak-nie/dialog-tak-nie.component';
import { CommonFunctionsService } from '../../../services/common-functions.service';
import { IContactPerson, IIdValue, ILoadBuy, ILoad } from '../../../shared/interfaces/iload';
import { IValueViewValue } from '../../../shared/interfaces/ivalue-view-value';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material";
import * as moment from 'moment';
import { INavDetailInfo } from 'app/shared/interfaces/inav-detail-info';
import { FormGroupName } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { Subject } from 'rxjs';
import { ICurrency } from '@bpShared/currency/interfaces/i-currency';

@Component({

  selector: 'app-load-buy',
  templateUrl: './load-buy.component.html',
  styleUrls: ['./load-buy.component.css']
})
export class LoadBuyComponent implements OnInit, OnDestroy, IDetailObj {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true); this.isDestroyed$.unsubscribe();;
  }
  @Input() rForm: FormGroup;
  @Input() routeId: number;
  @Input() fb: FormBuilder;

  constructor(
    private dialogTakNie: MatDialog,
    private actRoute: ActivatedRoute,
    private df: LoadService,
    public cf: CommonFunctionsService) { }

  ngOnInit() 
  {
    this.isDestroyed$ = new Subject<boolean>();
    this.palletsTypes = this.cf.getViewValueLoadRoutePalletType();
    this.initForm();
    this.initData();
  }


  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  adr_classes: IValueViewValue[] = this.cf.getViewValueLoadAddrClasses();
  load_lengthUnits: string[] = [];
  waysOfLoading: IValueViewValue[] = this.cf.getViewValueLoadWaysOfLoad();
  palletsTypes: IValueViewValue[];
  truckBody: IValueViewValue[] = this.cf.getViewValueLoadTruckBody();
  typeOfLoad: IValueViewValue[] = this.cf.getViewValueLoadTypeOfLoad();



  public navDetailInfo: INavDetailInfo = <INavDetailInfo>
    {
      basicActions: {
        canDownload: false,
      },
      title: {
        subtitle: "",
        title: "Zakup ładunku"
      }
    }

  get buy(): FormGroup {
    return <FormGroup>this.rForm.get('buy');
  }

  get buyingInfo(): FormGroup {
    return <FormGroup>this.rForm.get('buy.buying_info');
  }

  get buyingInfoPrice(): FormGroup {
    return <FormGroup>this.rForm.get('buy.buying_info.price');
  }

  get buyingInfoPaymentTerms(): FormGroup
  {
    return <FormGroup>this.rForm.get('buy.buying_info.paymentTerms');
  }

  get buyingInfoCompany(): FormGroup {
    return <FormGroup>this.rForm.get('buy.buying_info.company');
  }


  get loadInfo(): FormGroup 
  {
    return <FormGroup>this.rForm.get('buy.load_info');
  }

  get loadInfoExtra(): FormGroup {
    return <FormGroup>this.rForm.get('buy.load_info.extraInfo');
  }


  get routes(): FormArray
  {
    return (<FormArray>this.rForm.get('buy.routes'));
  }

  get transEu():FormGroup
  {
    return <FormGroup>this.rForm.get('transEu');
  }




  currencyChange($event: ICurrency) {
    this.rForm.get('buy.price_currency').setValue($event.name);
  }


  initData(): void { };
  initForm() { };





  loadingPlaceGroupAdd() {
    let addresGroup = this.cf.formAddressGroup(this.fb);
    let geoGroup = this.cf.formGeoGroup(this.fb);
    let lastDate, loadingType: string;

    if (this.routes.length > 0) {
      let lastRoute = this.routes.at(this.routes.length - 1);
      loadingType = lastRoute.value.loading_type == "Załadunek" ? "Rozładunek" : "Załadunek";

      lastDate = lastRoute.get('loading_date').value.add(2, 'hours').minutes(0);
    } else {
      lastDate = moment().add(1, 'hours');
      loadingType = "Załadunek"
    }

    return this.fb.group({
      loading_date: [lastDate, Validators.required],
      loading_type: [loadingType, Validators.required],
      address: addresGroup,
      geo: geoGroup,
      info: [null],
      pallets: this.fb.array([]),
    });
  }

  routeAdd() {
    this.routes.push(this.loadingPlaceGroupAdd());
  }

  routeGetAt(idx) {
    return (<FormArray>this.rForm.get('buy.routes')).at(idx);
  }

  routeRemove(idx) {
    let group = this.routes.at(idx).value;
    let groupName = `${group.loading_type},  ${group.address.locality} ${group.address.street_address}`;
    let dTakNie = this.dialogTakNie.open(DialogTakNieComponent, { data: <IDialogTakNieInfo>{ title: 'Ładunek', question: 'Czy na pewno usunąć adres ' + groupName + ' ?' } });
    dTakNie.afterClosed()
      .takeUntil(this.isDestroyed$)
      .subscribe((s: boolean) => {
        if (s === true) {
          this.routes.removeAt(idx);
          this.buy.markAsDirty();
        }
      });
  }

  palletAdd(load: FormGroup) {
    let pallets = load.get('pallets');
    (<FormArray>pallets).push(this.cf.formLoadBuyPallets(this.fb, this.isDestroyed$));
  }
  palletRemove(load: FormGroup, id: number)
   {
    let pallets = load.get('pallets');
    (<FormArray>pallets).removeAt(id);
    console.log('palletRemove');
    this.buy.markAsDirty();

  }





  public initRouteId(): void 
  {
    this.actRoute.paramMap
      .takeUntil(this.isDestroyed$)
      .subscribe(s => {
        this.routeId = +s.get('id');
      })
  }

  public navCancel(): void {
    throw new Error('Not implemented yet.');
  }

  public navDownload(): void {
    throw new Error('Not implemented yet.');
  }

  public navDelete(): void {
    throw new Error('Not implemented yet.');
  }

  public navSave(): void 
  {
    let id = this.rForm.value.loadId!=null ? this.rForm.value.loadId: 0;
    let f = <ILoad>this.rForm.value;
    let reqObj=<ILoad>{
      buy: f.buy,
      creationInfo: f.creationInfo,
      loadExtraInfo: f.loadExtraInfo,
      loadId: f.loadId,
      loadNo:f.loadNo,
      // sell:f.sell.loadSellId? f.sell: null,
      // transEu: f.transEu.transEuId? f.transEu: null,
    }
    this.df.updateBuy(id, reqObj)
      .switchMap(sw => this.df.getById(sw["loadId"]).take(1))
      .take(1)
      .subscribe(s => {
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
      });
  }
}
