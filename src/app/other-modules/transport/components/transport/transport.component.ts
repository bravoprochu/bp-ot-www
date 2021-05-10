import { ITransportOffer } from "../../interfaces/itransport-offer";
import { FormBuilder, FormControl } from "@angular/forms";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { IDetailObj } from "app/shared/idetail-obj";
import { INavDetailInfo } from "app/shared/interfaces/inav-detail-info";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { IDialogTakNie } from "app/other-modules/dialog-confirmations/interfaces/i-dialog-tak-nie";
import { empty, Subject, of } from "rxjs";
import { ICurrency } from "app/other-modules/currency/interfaces/i-currency";
import { finalize, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { TransportService } from "../../services/transport.service";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { DateTimeCommonServiceService } from "app/other-modules/date-time-common/services/date-time-common-service.service";

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
    private dateTimeService: DateTimeCommonServiceService,
    private df: TransportService,
    private dialogConfirmationService: DialogConfirmationsService,
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
          this.df.patchTransport(data, this.rForm, this.fb);
          this.rForm.markAsPristine();
        });
    } else {
      const NOW_ISO = new Date().toISOString();
      this.loadDate.patchValue(this.addHoursAndFormat(NOW_ISO, 1));
      this.unloadDate.patchValue(this.addHoursAndFormat(NOW_ISO, 2));
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
      const data = {
        question: `Czy na pewno potwierdzić dostarczenie ładunku do ${this.unloadPlace.value} ? (automatycznie zostanie utworzona faktura sprzedaży)`,
        title: "Transport - potwierdzenie dostarczenia",
      } as IDialogTakNie;

      this.dialogConfirmationService
        .getTakNieDialog(data)
        .pipe(
          switchMap((czyPLN) => {
            if (czyPLN) {
              if (actCurr.name == "PLN") {
                return of(true);
              } else {
                const data2 = {
                  title: "Waluta faktury",
                  question: `UWAGA, sprawdź regulamin zlecenia.  Zlecenie jest w ${actCurr.description}, czy faktura ma być przeliczona i wystawiona w walucie PLN ?`,
                } as IDialogTakNie;

                return this.dialogConfirmationService.getTakNieDialog(data2);
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
          this.df.patchTransport(s, this.rForm, this.fb);
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

    const data = {
      title: "Zlecenia transportowe",
      question:
        "Czy na pewno chcesz usunąć to zlecenie, dane zostaną całkowicie usunięte z serwera ?",
    } as IDialogTakNie;

    this.dialogConfirmationService
      .getTakNieDialog(data)
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
    const d = this.rForm.value.tradeInfo.date;

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
        this.df.patchTransport(s, this.rForm, this.fb);
        this.rForm.markAsPristine();
      });
  }

  private addHoursAndFormat(dateTimeISO: string, hours: number): string {
    return this.dateTimeService.formatYYYYMMDTHHMMSS(
      this.dateTimeService.startOf(
        this.dateTimeService.addToIsoDate(dateTimeISO, hours, "hours"),
        "hour"
      )
    );
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
