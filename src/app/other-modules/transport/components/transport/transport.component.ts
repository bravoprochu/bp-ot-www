import { ITransportOffer } from "../../interfaces/itransport-offer";
import { FormBuilder, FormControl } from "@angular/forms";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { IDetailObj } from "app/shared/idetail-obj";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { FormGroup } from "@angular/forms/src/model";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { DialogTakNieComponent } from "app/other-modules/dialog-tak-nie/components/dialog-tak-nie/dialog-tak-nie.component";
import { IDialogTakNieInfo } from "app/shared/interfaces/idialog-tak-nie-info";
import { Observable, empty, Subject, of } from "rxjs";
import * as moment from "moment";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { finalize, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { TransportService } from "../../services/transport.service";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";

@Component({
  selector: "app-transport",
  templateUrl: "./transport.component.html",
  styleUrls: ["./transport.component.css"],
})
export class TransportComponent implements OnInit, OnDestroy, IDetailObj {
  isDestroyed$ = new Subject<boolean>();
  isFormReady = false;
  isPending = true;
  navDetailInfo: INavDetailInfo = <INavDetailInfo>{
    basicActions: {},
    title: {
      subtitle: "Tworzenie, edycja zleceń transportowych",
      title: "Transport",
    },
  };
  fb = new FormBuilder();
  rForm: FormGroup;
  routeId: number;

  constructor(
    private actRoute: ActivatedRoute,
    private df: TransportService,
    private dialogTakNie: MatDialog,
    private momentService: MomentCommonService,
    private router: Router,
    private toastService: ToastMakeService
  ) {}

  ngOnDestroy(): void {
    this.isDestroyed$.next(true);
    this.isDestroyed$.complete();
    this.isDestroyed$.unsubscribe();
  }

  ngOnInit(): void {
    this.initRouteId();
    this.initForm();
    this.initData();
  }

  initForm(): void {
    this.rForm = this.df.formTransportGroup(this.fb, this.isDestroyed$);
  }

  initRouteId(): void {
    this.actRoute.paramMap.pipe(takeUntil(this.isDestroyed$)).subscribe((s) => {
      this.routeId = +s.get("id");
    });
  }
  initData(): void {
    this.isPending = true;
    if (this.routeId > 0) {
      this.navDetailInfo.basicActions.canDelete = true;
      this.df
        .getById(this.routeId)
        .pipe(
          take(1),
          takeUntil(this.isDestroyed$),
          finalize(() => {
            this.isPending = false;
            this.isFormReady = true;
          })
        )
        .subscribe((data: ITransportOffer) => {
          this.toastService.toastMake(
            `Pobrano dane ${data.offerNo}, [id: ${data.transportOfferId}]`,
            "initData"
          );
          this.df.patchTransport(data, this.rForm, this.fb, this.isDestroyed$);
          this.rForm.markAsPristine();
        });
    } else {
      this.loadDate.patchValue(this.momentService.getNextHour());
      this.unloadDate.patchValue(this.momentService.getNextHour(2));
      this.isPending = false;
      this.isFormReady = true;
    }
  }

  invoiceSellGen(): void {
    if (!this.id.value) {
      return;
    }
    this.isPending = true;
    let id = this.id.value;
    let actCurr: ICurrency = <ICurrency>this.currency.value;

    if (!this.invoiceSellId.value) {
      this.dialogTakNie
        .open(DialogTakNieComponent, {
          data: <IDialogTakNieInfo>{
            question: `Czy na pewno potwierdzić dostarczenie ładunku do ${this.unloadPlace.value} ? (automatycznie zostanie utworzona faktura sprzedaży)`,
            title: "Transport - potwierdzenie dostarczenia",
          },
        })
        .afterClosed()
        .pipe(
          switchMap((czyPLN) => {
            if (czyPLN) {
              if (actCurr.name == "PLN") {
                return of(true);
              } else {
                return this.dialogTakNie
                  .open(DialogTakNieComponent, {
                    data: <IDialogTakNieInfo>{
                      title: "Waluta faktury",
                      question: `UWAGA, sprawdź regulamin zlecenia.  Zlecenie jest w ${actCurr.description}, czy faktura ma być przeliczona i wystawiona w walucie PLN ?`,
                    },
                  })
                  .afterClosed();
              }
            } else {
              this.isPending = false;
              return empty();
            }
          }),
          switchMap((sw) => {
            this.toastService.toastMake(
              "Generuję fakturę sprzedaży",
              "Transport - potwierdzenie"
            );
            if (sw) {
              return this.df.invoiceSellGen(id, true);
            } else {
              return this.df.invoiceSellGen(id, false);
            }
          }),
          switchMap((sw) => this.df.getById(id)),
          tap((d) =>
            this.toastService.toastMake(
              "Pobieram zaktualizowane dane",
              "Transport - potwierdzenie"
            )
          ),
          take(1),
          finalize(() => (this.isPending = false)),
          takeUntil(this.isDestroyed$)
        )
        .subscribe((s) => {
          this.df.patchTransport(s, this.rForm, this.fb, this.isDestroyed$);
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
    if (this.id.value == null) {
      return;
    }

    this.dialogTakNie
      .open(DialogTakNieComponent, {
        data: <IDialogTakNieInfo>{
          title: "Zlecenia transportowe",
          question:
            "Czy na pewno chcesz usunąć to zlecenie, dane zostaną całkowicie usunięte z serwera ?",
        },
      })
      .afterClosed()
      .pipe(
        switchMap((sw) => {
          if (sw) {
            this.toastService.toastMake(
              `Trwa usuwanie zlecenia transportowego ${this.offerNo.value}`,
              "navDelete"
            );
            return this.df.delete(this.id.value).pipe(take(1));
          } else {
            return empty();
          }
        }),
        take(1)
      )

      .subscribe((s) => {
        if (s != null) {
          this.toastService.toastMake(s["info"], "navDelete");
        } else {
          this.toastService.toastMake(`Usunięto dane`, "navDelete");
          this.router.navigate(["transport"]);
        }
      });
  }

  navSave(): void {
    this.isPending = true;
    const id =
      this.rForm.value.transportOfferId == null
        ? 0
        : this.rForm.value.transportOfferId;
    const d: moment.Moment = this.rForm.value.tradeInfo.date;

    this.df
      .update(id, this.rForm.value)
      .pipe(
        take(1),
        switchMap((sw) => {
          this.toastService.toastMake(`Aktualizuje dane`, "navSave");
          return this.df.getById(id).pipe(take(1));
        }),
        finalize(() => {
          this.isPending = false;
        }),
        takeUntil(this.isDestroyed$)
      )
      .subscribe((s) => {
        this.toastService.toastMake(
          `Pobrano zaktualizowane dane ${s.offerNo}, [id: ${s.transportOfferId}]`,
          "navSave"
        );
        this.df.patchTransport(s, this.rForm, this.fb, this.isDestroyed$);
        this.rForm.markAsPristine();
      });
  }

  //#region getters
  get company(): FormGroup {
    return <FormGroup>this.rForm.get("tradeInfo.company");
  }

  get creationInfo(): FormGroup {
    return <FormGroup>this.rForm.get("creationInfo");
  }

  get currency(): FormControl {
    return <FormControl>this.rForm.get("tradeInfo.price.currency");
  }

  get id(): FormControl {
    return <FormControl>this.rForm.get("transportOfferId");
  }

  get invoiceInPLN(): FormControl {
    return <FormControl>this.rForm.get("invoiceInPLN");
  }

  get invoiceSellId(): FormControl {
    return <FormControl>this.rForm.get("invoiceSellId");
  }

  get invoiceSellNo(): FormControl {
    return <FormControl>this.rForm.get("invoiceSellNo");
  }

  get load(): FormGroup {
    return <FormGroup>this.rForm.get("load");
  }

  get loadDate(): FormControl {
    return <FormControl>this.rForm.get("load.date");
  }

  get offerNo(): FormControl {
    return <FormControl>this.rForm.get("offerNo");
  }

  get paymentTerms(): FormGroup {
    return <FormGroup>this.rForm.get("tradeInfo.paymentTerms");
  }

  get price(): FormGroup {
    return <FormGroup>this.rForm.get("tradeInfo.price");
  }

  get tradeInfo(): FormGroup {
    return <FormGroup>this.rForm.get("tradeInfo");
  }

  get unload(): FormGroup {
    return <FormGroup>this.rForm.get("unload");
  }
  get unloadPlace(): FormControl {
    return <FormControl>this.rForm.get("unload.locality");
  }
  get unloadDate(): FormControl {
    return <FormControl>this.rForm.get("unload.date");
  }
  //#endregion
}
