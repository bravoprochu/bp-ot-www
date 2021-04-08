import { ActivatedRoute } from "@angular/router";
import { LoadService } from "../services/load.service";
import { IDetailObj } from "../../../shared/idetail-obj";
import { IDialogTakNie } from "../../../other-modules/dialog-confirmations/interfaces/i-dialog-tak-nie";
import { CommonFunctionsService } from "../../../services/common-functions.service";
import { ILoad } from "../../../shared/interfaces/iload";
import { IValueViewValue } from "../../../shared/interfaces/ivalue-view-value";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { Subject } from "rxjs";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { switchMap, take, takeUntil } from "rxjs/operators";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";

@Component({
  selector: "app-load-buy",
  templateUrl: "./load-buy.component.html",
  styleUrls: ["./load-buy.component.css"],
})
export class LoadBuyComponent implements OnInit, OnDestroy, IDetailObj {
  @Input() rForm: FormGroup;
  @Input() routeId: number;
  @Input() fb: FormBuilder;
  isDestroyed$: Subject<boolean>;
  isPending: boolean;
  adr_classes: IValueViewValue[] = this.cf.getViewValueLoadAddrClasses();
  load_lengthUnits: string[] = [];
  waysOfLoading: IValueViewValue[] = this.cf.getViewValueLoadWaysOfLoad();
  palletsTypes: IValueViewValue[];
  truckBody: IValueViewValue[] = this.cf.getViewValueLoadTruckBody();
  typeOfLoad: IValueViewValue[] = this.cf.getViewValueLoadTypeOfLoad();

  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    basicActions: {
      canDownload: false,
    },
    title: {
      subtitle: "",
      title: "Zakup ładunku",
    },
  };

  constructor(
    private dialogConfirmationService: DialogConfirmationsService,
    private actRoute: ActivatedRoute,
    private df: LoadService,
    public cf: CommonFunctionsService,
    private contractorService: ContractorService,
    private momentService: MomentCommonService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.palletsTypes = this.cf.getViewValueLoadRoutePalletType();
    this.initForm();
    this.initData();
  }

  compareWithValueViewValue(): void {}

  currencyChange($event: ICurrency) {
    this.rForm.get("buy.price_currency").setValue($event.name);
  }

  initData(): void {}
  initForm() {}

  loadingPlaceGroupAdd() {
    let addresGroup = this.contractorService.formAddressGroup(this.fb);
    let geoGroup = this.cf.formGeoGroup(this.fb);
    let lastDate, loadingType: string;

    if (this.routes.length > 0) {
      let lastRoute = this.routes.at(this.routes.length - 1);
      loadingType =
        lastRoute.value.loading_type == "Załadunek"
          ? "Rozładunek"
          : "Załadunek";

      lastDate = lastRoute.get("loading_date").value.add(2, "hours").minutes(0);
    } else {
      lastDate = this.momentService.getToday().add(1, "hours");
      loadingType = "Załadunek";
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
    return (<FormArray>this.rForm.get("buy.routes")).at(idx);
  }

  routeRemove(idx) {
    let group = this.routes.at(idx).value;
    let groupName = `${group.loading_type},  ${group.address.locality} ${group.address.street_address}`;

    const data = {
      title: "Ładunek",
      question: "Czy na pewno usunąć adres " + groupName + " ?",
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s: boolean) => {
        if (s === true) {
          this.routes.removeAt(idx);
          this.buy.markAsDirty();
        }
      });
  }

  palletAdd(load: FormGroup) {
    let pallets = load.get("pallets");
    (<FormArray>pallets).push(
      this.cf.formLoadBuyPallets(this.fb, this.isDestroyed$)
    );
  }
  palletRemove(load: FormGroup, id: number) {
    let pallets = load.get("pallets");
    (<FormArray>pallets).removeAt(id);
    this.buy.markAsDirty();
  }

  initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
    });
  }

  navCancel(): void {
    throw new Error("Not implemented yet.");
  }

  navDownload(): void {
    throw new Error("Not implemented yet.");
  }

  navDelete(): void {
    throw new Error("Not implemented yet.");
  }

  navSave(): void {
    let id = this.rForm.value.loadId != null ? this.rForm.value.loadId : 0;
    let f = <ILoad>this.rForm.value;
    let reqObj = <ILoad>{
      buy: f.buy,
      creationInfo: f.creationInfo,
      loadExtraInfo: f.loadExtraInfo,
      loadId: f.loadId,
      loadNo: f.loadNo,
    };
    this.df
      .updateBuy(id, reqObj)
      .pipe(
        switchMap((sw) => this.df.getById(sw["loadId"]).pipe(take(1))),
        take(1)
      )
      .subscribe((s) => {
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
      });
  }

  get buy(): FormGroup {
    return <FormGroup>this.rForm.get("buy");
  }

  get buyingInfo(): FormGroup {
    return <FormGroup>this.rForm.get("buy.buying_info");
  }

  get buyingInfoPrice(): FormGroup {
    return <FormGroup>this.rForm.get("buy.buying_info.price");
  }

  get buyingInfoPaymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get("buy.buying_info.paymentTerms");
  }

  get buyingInfoCompany(): FormGroup {
    return <FormGroup>this.rForm.get("buy.buying_info.company");
  }

  get loadInfo(): FormGroup {
    return <FormGroup>this.rForm.get("buy.load_info");
  }

  get loadInfoExtra(): FormGroup {
    return <FormGroup>this.rForm.get("buy.load_info.extraInfo");
  }

  get routes(): FormArray {
    return <FormArray>this.rForm.get("buy.routes");
  }

  get transEu(): FormGroup {
    return <FormGroup>this.rForm.get("transEu");
  }
}
