import { LoadService } from "../services/load.service";
import { CommonFunctionsService } from "../../../services/common-functions.service";
import { IEmployee } from "../../../other-modules/contractors/interfaces/iemployee";
import { Subject } from "rxjs";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  ILoad,
  ILoadRoute,
  ILoadRoutePallete,
} from "app/shared/interfaces/iload";
import {
  ILoadTransEu,
  ITransEuPallete,
} from "app/shared/interfaces/i-load-trans-eu";
import { ILoadTransEuLoadingPlace } from "app/shared/interfaces/i-load-trans-eu-loading-place";
import { ILoadTransEuAddress } from "app/shared/interfaces/i-load-trans-eu-address";
import { IValueViewValue } from "app/shared/interfaces/ivalue-view-value";
import { MatSelect } from "@angular/material/select";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { switchMap, take, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-load-trans-eu",
  templateUrl: "./load-trans-eu.component.html",
  styleUrls: ["./load-trans-eu.component.css"],
})
export class LoadTransEuComponent implements OnInit, OnDestroy {
  @Input() rForm: FormGroup;
  @Input() fb: FormBuilder;
  @ViewChild("sel", /* TODO: add static flag */ {}) sel: MatSelect;

  constructor(
    private cf: CommonFunctionsService,
    private df: LoadService,
    private contractorService: ContractorService
  ) {}

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  //contact: FormControl;
  contact: IEmployee[];
  isDestroyed$: Subject<boolean>;
  loadTransEu: ILoadTransEu = <ILoadTransEu>{};

  compareWith(obj1: IEmployee, obj2: IEmployee) {
    if (obj1 == undefined || obj2 == undefined) {
      return;
    }
    return obj1.companyEmployeeId == obj2.companyEmployeeId;
  }

  initForm() {
    this.transEuLoadMapper(this.rForm.value);
    this.contact = this.rForm.value.transEu.contactPersonsList;
    this.rForm.valueChanges
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s: ILoad) => {
        this.transEuLoadMapper(s);
      });

    this.sel.selectionChange
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.contactPersonsList.controls = [];
        s.value.forEach(() => {
          this.contactPersonsList.push(
            this.contractorService.formEmployeeGroup(this.fb)
          );
        });
        this.contactPersonsList.patchValue(s.value, { emitEvent: true });
      });
  }

  navPublish(): void {
    this.transEuId.setValue("dfadf@#%2");
  }

  navSave(): void {
    let id = this.rForm.value.loadId;
    let f = <ILoad>this.rForm.value;
    let reqObj = <ILoad>{
      buy: f.buy,
      creationInfo: f.creationInfo,
      //loadExtraInfo: f.loadExtraInfo,
      loadId: f.loadId,
      loadNo: f.loadNo,
      transEu: f.transEu,
    };
    this.df
      .updateTransEu(id, reqObj)
      .pipe(
        switchMap(() => this.df.getById(id).pipe(take(1))),
        take(1),
        takeUntil(this.isDestroyed$)
      )

      .subscribe((s) => {
        this.cf.patchLoad(s, this.rForm, this.fb, this.isDestroyed$);
      });
  }

  transEuLoadMapper(rform: ILoad) {
    this.loadTransEu = <ILoadTransEu>{};

    this.loadTransEu = <ILoadTransEu>{
      description:
        rform.buy.load_info.description != null
          ? rform.buy.load_info.description
          : "",
      price: rform.transEu.price.price,
      price_currency: rform.transEu.price.currency.name,
      is_for_clearence: rform.buy.load_info.extraInfo.is_for_clearence,
      is_lift_required: rform.buy.load_info.extraInfo.is_lift_required,
      is_ltl: rform.buy.load_info.extraInfo.is_ltl,
      is_tir_cable_required:
        rform.buy.load_info.extraInfo.is_tir_cable_required,
      is_tracking_system_required:
        rform.buy.load_info.extraInfo.is_tracking_system_required,
      is_truck_crane_required:
        rform.buy.load_info.extraInfo.is_truck_crane_required,
      load_height: rform.buy.load_info.load_height,
      load_length: rform.buy.load_info.load_length,
      load_volume: rform.buy.load_info.load_volume,
      load_weight: rform.buy.load_info.load_weight,
      required_truck_body: {
        id: rform.buy.load_info.extraInfo.required_truck_body.value,
      },
      type_of_load: {
        id:
          rform.buy.load_info.extraInfo.type_of_load != null
            ? rform.buy.load_info.extraInfo.type_of_load.value
            : null,
      },
      contact_person: [],
      required_adr_classes: [],
      required_ways_of_loading: [],
    };
    //ADR
    rform.buy.load_info.extraInfo.required_adr_classes.forEach(
      (a: IValueViewValue) => {
        this.loadTransEu.required_adr_classes.push(a.value);
      }
    );
    rform.buy.load_info.extraInfo.required_ways_of_loading.forEach(
      (load: IValueViewValue) => {
        this.loadTransEu.required_ways_of_loading.push(load.value);
      }
    );

    this.prepPersonsList(rform);
    this.preploading(rform);
    this.prepPallets(rform);
    //this.prepDescription(frm);
  }

  preploading(frm: ILoad) {
    let loadings: ILoadRoute[] = [];
    let unloadings: ILoadRoute[] = [];
    let firstLoading = frm.buy.routes[0];
    let lastUnloading: ILoadRoute;
    let extraLoadingsStr: string = "";
    let extraUnloadingsStr: string = "";

    if (firstLoading == null) {
      return;
    }

    frm.buy.routes.forEach((route) => {
      if (route.loading_type == "Rozładunek") {
        unloadings.push(route);
        lastUnloading = route;
      } else {
        loadings.push(route);
      }
    });

    //loading_place
    this.loadTransEu.loading_place = <ILoadTransEuLoadingPlace>{
      address: <ILoadTransEuAddress>{
        country: firstLoading.address.country,
        locality: firstLoading.address.locality,
        postal_code: firstLoading.address.postal_code,
      },
      geo: firstLoading.geo,
    };
    this.loadTransEu.loading_date = firstLoading.loading_date;

    //unloading_place
    if (lastUnloading != null) {
      this.loadTransEu.unloading_place = <ILoadTransEuLoadingPlace>{
        address: <ILoadTransEuAddress>{
          country: lastUnloading.address.country,
          locality: lastUnloading.address.locality,
          postal_code: lastUnloading.address.postal_code,
        },
        geo: lastUnloading.geo,
      };
      this.loadTransEu.unloading_date = lastUnloading.loading_date;
    }
    //extra loading
    if (loadings.length > 1) {
      extraLoadingsStr = "\n---EXTRA ZAŁADUNEK---";
      let idx = 0;
      loadings.forEach((load) => {
        if (idx > 0) {
          extraLoadingsStr +=
            "\n" +
            load.address.country +
            " " +
            load.address.postal_code +
            ", " +
            load.address.locality;
        }
        idx++;
      });
      this.loadTransEu.description += extraLoadingsStr;
    }
    //extra unloading
    if (unloadings.length > 1) {
      extraUnloadingsStr = "\n---EXTRA ROZŁADUNEK---";
      let idx = 0;
      unloadings.forEach((load) => {
        if (idx < unloadings.length - 1) {
          extraUnloadingsStr +=
            "\n" +
            load.address.country +
            " " +
            load.address.postal_code +
            ", " +
            load.address.locality;
        }
        idx++;
      });
      this.loadTransEu.description += extraUnloadingsStr;
    }
  }

  prepPersonsList(rForm: ILoad) {
    let res = [];
    rForm.transEu.contactPersonsList.forEach((emp) => {
      let contact = {
        id: emp.trans_id,
      };
      res.push(contact);
    });
    this.loadTransEu.contact_person = res;
  }

  private prepPallets(frm: ILoad) {
    let pallets: ILoadRoutePallete[] = [];
    let extraPalletsStr: string = "";
    frm.buy.routes.forEach((r) => {
      if (r.loading_type == "Załadunek" && r.pallets.length > 0) {
        r.pallets.forEach((p) => {
          pallets.push(p);
        });
      }
    });
    if (pallets.length > 0) {
      let firstPallet = pallets[0];
      let pallet = <ITransEuPallete>{
        amount: firstPallet.amount,
        dimmensions: firstPallet.dimmension,
        info: firstPallet.info,
        is_exchangeable: firstPallet.is_exchangeable,
        is_stackable: firstPallet.is_stackable,
        type: firstPallet.type.value,
      };
      this.loadTransEu.pallets = pallet;
    }

    if (pallets.length > 1) {
      let idx: number = 0;
      extraPalletsStr += "\n---EXTRA PALETY---";
      pallets.forEach((pallet) => {
        if (idx > 0) {
          let dimmension =
            pallet.type.value == "Other" ? pallet.dimmension : "";
          let is_exchangeable = pallet.is_exchangeable
            ? " paleta wymienialna"
            : "";
          let is_stackable = pallet.is_stackable ? " paleta wymnienialna" : "";
          let info =
            pallet.is_stackable || pallet.is_exchangeable
              ? `[${is_exchangeable}${is_stackable}]`
              : "";
          let palletInfo =
            pallet.info != null && pallet.info.length > 0
              ? `(${pallet.info})`
              : "";

          extraPalletsStr += `\n ${pallet.type.value} ${pallet.amount} szt. ${dimmension} ${info} ${palletInfo}`;
        }
        idx++;
      });
    }

    this.loadTransEu.description += extraPalletsStr;
  }

  get contactPersonsList(): FormArray {
    return <FormArray>this.rForm.get("transEu.contactPersonsList");
  }

  get sellingCompany(): FormGroup {
    return <FormGroup>this.rForm.get("transEu.sellingCompany");
  }

  get price(): FormGroup {
    return <FormGroup>this.rForm.get("transEu.price");
  }

  get sell(): FormGroup {
    return <FormGroup>this.rForm.get("sell");
  }

  get transEu(): FormGroup {
    return <FormGroup>this.rForm.get("transEu");
  }
  get transEuId(): FormControl {
    return <FormControl>this.rForm.get("transEu.transEuId");
  }
}
