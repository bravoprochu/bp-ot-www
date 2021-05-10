import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { TransportService } from "../../services/transport.service";

import { TransportListComponent } from "./transport-list.component";

describe("TransportListComponent", () => {
  let component: TransportListComponent;
  let fixture: ComponentFixture<TransportListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransportListComponent],
        imports: [
          BrowserAnimationsModule,
          HttpClientModule,
          ContractorsModule,
          ToastMakeModule,
          RouterModule.forRoot([]),
        ],
        providers: [
          PaymentTermsService,
          CurrencyCommonService,
          ContractorService,
          TokenService,
          TransportService,
          ToastMakeService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
