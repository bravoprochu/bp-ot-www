import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NavListComponent } from "app/other-modules/nav-list/components/nav-list/nav-list.component";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { PendingComponent } from "app/other-modules/pending-indicator/components/pending/pending.component";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import { InvoiceBuyService } from "../services/invoice-buy.service";

import { InvoiceBuyListComponent } from "./invoice-buy-list.component";

describe("InvoiceBuyListComponent", () => {
  let component: InvoiceBuyListComponent;
  let fixture: ComponentFixture<InvoiceBuyListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          InvoiceBuyListComponent,
          NavListComponent,
          PendingComponent,
        ],
        imports: [
          BrowserAnimationsModule,
          ContractorsModule,
          CurrencyModule,
          DialogConfirmationsModule,
          HttpClientModule,
          MatTableModule,
          MatSortModule,
          MatPaginatorModule,
          PaymentTermsModule,
          RouterModule.forRoot([]),
          ToastMakeModule,
        ],
        providers: [
          ContractorService,
          CurrencyCommonService,
          DialogConfirmationsService,
          ToastMakeService,
          InvoiceBuyService,
          InvoiceCommonFunctionsService,
          PaymentTermsService,
          TokenService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBuyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
