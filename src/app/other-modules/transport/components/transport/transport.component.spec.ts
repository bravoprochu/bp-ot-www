import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { TransportService } from "../../services/transport.service";

import { TransportComponent } from "./transport.component";

describe("TransportComponent", () => {
  let component: TransportComponent;
  let fixture: ComponentFixture<TransportComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransportComponent],
        imports: [
          BrowserAnimationsModule,
          ContractorsModule,
          CurrencyModule,
          DialogConfirmationsModule,
          HttpClientModule,
          PaymentTermsModule,
          RouterModule.forRoot([]),
          ToastMakeModule,
        ],
        providers: [
          ContractorService,
          CurrencyCommonService,
          DialogConfirmationsService,
          PaymentTermsService,
          ToastMakeService,
          TokenService,
          TransportService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
