import { LoadBuyComponent } from "../load-buy/load-buy.component";
import { AfterViewInit, ViewChild } from "@angular/core";
import { ILoad } from "../../../shared/interfaces/iload";
import { CommonFunctionsService } from "../../../services/common-functions.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { IDetailObj } from "app/shared/idetail-obj";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { LoadService } from "app/ui/loads/services/load.service";
import { saveAs } from "file-saver";
import { Subject } from "rxjs";
import {
  debounceTime,
  delay,
  map,
  switchMap,
  take,
  takeUntil,
  takeWhile,
} from "rxjs/operators";

@Component({
  selector: "app-load",
  templateUrl: "./load.component.html",
  styleUrls: ["./load.component.css"],
})
export class LoadComponent
  implements OnInit, OnDestroy, AfterViewInit, IDetailObj {
  @ViewChild("loadBuy", /* TODO: add static flag */ {})
  loadBuy: LoadBuyComponent;
  dataObj: any;
  isDestroyed$: Subject<boolean>;
  isPending: boolean = true;
  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    title: {
      subtitle: "szczegóły, edycja",
      title: "Ładunek",
    },
    basicActions: {},
  };
  deficyt: number;
  rForm: FormGroup;
  routeId: number;

  constructor(
    public fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private df: LoadService,
    private cf: CommonFunctionsService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initRouteId();
    this.initForm();
    this.initData();
  }

  get buy(): FormGroup {
    return <FormGroup>this.rForm?.get("buy");
  }

  get buyId(): FormControl {
    return <FormControl>this.rForm?.get("buy.loadBuyId");
  }
  get buyingInfoPrice() {
    return this.rForm?.get("buy.buying_info.price");
  }

  get creationInfo(): FormControl {
    return <FormControl>this.rForm?.get("creationInfo");
  }
  get isTransEu(): boolean {
    return this.rForm?.value.transEu;
  }

  get isSell(): boolean {
    return this.rForm?.value.sell.loadSellId;
  }

  get isSellInvoiceSell(): boolean {
    return this.rForm?.value.sell;
  }

  get loadExtraInfo(): FormGroup {
    return <FormGroup>this.rForm?.get("loadExtraInfo");
  }

  get sell(): FormGroup {
    return <FormGroup>this.rForm?.get("sell");
  }

  get sellingInfoPrice() {
    return this.rForm?.get("sell.selling_info.price");
  }

  get transEu(): FormGroup {
    return <FormGroup>this.rForm?.get("transEu");
  }

  get buyingPrice() {
    return this.rForm?.get("buy.buying_info.price");
  }

  initForm(): void {
    this.rForm = this.cf.formLoadGroup(this.fb, this.isDestroyed$);
  }

  initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
    });
  }

  initData(): void {
    if (this.routeId > 0) {
      this.df
        .getById(this.routeId)
        .pipe(take(1))
        .subscribe((s: ILoad) => {
          this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
          this.isPending = false;
        });
    } else {
      this.isPending = false;
    }
  }

  invoiceSellGen() {
    this.isPending = true;
    let id = this.rForm?.value.loadId;
    this.df
      .loadInvoiceSellGen(id)
      .pipe(
        take(1),
        switchMap(() => this.df.getById(id).pipe(take(1))),
        take(1)
      )

      .subscribe((s) => {
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
        this.isPending = false;
      });
  }

  public ngAfterViewInit(): void {
    this.rForm?.valueChanges
      .pipe(
        delay(1000),
        debounceTime(1000),
        takeWhile(() => this.isDestroyed$ && this.rForm?.value.sell)
      )

      .subscribe(() => {
        if (this.rForm?.valid) {
        }
      });
  }

  formUpdate() {
    this.rForm?.markAsDirty();
  }

  navGetCode(): void {
    console.log(JSON.stringify(this.rForm?.value));
  }

  navCancel(): void {}
  navDownload(): void {
    throw new Error("Method not implemented.");
  }
  navDelete(): void {
    throw new Error("Method not implemented.");
  }
  navSave(): void {}

  offerGenPdf() {
    this.df
      .genPdf(this.rForm?.value)
      .pipe(
        map((res) => {
          return new Blob([res, "application/pdf"], {
            type: "application/pdf",
          });
        }),
        takeUntil(this.isDestroyed$)
      )

      .subscribe((s) => {
        saveAs(
          s,
          "Zlecenie przewozowe nr " + this.rForm?.get("loadNo").value + ".pdf"
        );
      });
  }
}
