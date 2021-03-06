import { LoadDataTableSource } from "../services/load-data-table-source";
import { CommonFunctionsService } from "../../../services/common-functions.service";
import { Subject } from "rxjs";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { IListObj } from "app/shared/ilist-obj";
import { ITitle } from "app/shared/ititle";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSlider } from "@angular/material/slider";
import { LoadService } from "app/ui/loads/services/load.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-load-list",
  templateUrl: "./load-list.component.html",
  styleUrls: ["./load-list.component.css"],
})
export class LoadListComponent
  implements OnInit, OnDestroy, IListObj, AfterViewInit {
  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }
  @ViewChild("slider", /* TODO: add static flag */ {}) slider: MatSlider;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private df: LoadService,
    private cf: CommonFunctionsService
  ) {}
  dataSource: LoadDataTableSource;
  navTitle: ITitle = {
    subtitle: "Lista zapisanych",
    title: "Ładunki",
  };
  isPending: boolean = true;
  dataObj = [];
  contrahentsIds: number[] = [];
  dataObj$: any;
  isDestroyed$: Subject<boolean>;
  refreshTime: number = 0;
  displayedColumns = [
    "loadId",
    "loadNo",
    "companyBuyer",
    "buyingDate",
    "buyingPrice",
    "companySeller",
    "sellingDate",
    "sellingPrice",
  ];

  ngOnInit() {
    this.isDestroyed$ = new Subject<boolean>();
    this.dataSource = new LoadDataTableSource(this.df);
    this.initData();
  }

  ngAfterViewInit(): void {}

  createNew() {
    this.router.navigate(["/ladunek", 0]);
  }

  edit(id: number): void {
    this.router.navigate(["/ladunek", id]);
  }

  initData() {
    this.dataSource
      .connect()
      .pipe(takeUntil(this.isDestroyed$))
      .subscribe((s) => {
        this.isPending = false;
      });
  }

  isLoadId(id: number): boolean {
    let res = false;
    this.dataObj.forEach((l) => {
      if (l.id == id) res = true;
    });
    return res;
  }

  isLoadCustomer(id: number): boolean {
    return this.contrahentsIds.indexOf(id) > -1 ? true : false;
  }
}
