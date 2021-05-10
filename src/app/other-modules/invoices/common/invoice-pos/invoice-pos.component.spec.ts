import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { InvoiceSellService } from "../../invoice-sell/services/invoice-sell.service";
import { InvoiceCommonFunctionsService } from "../invoice-common-functions.service";

import { InvoicePosComponent } from "./invoice-pos.component";

describe("InvoicePosComponent", () => {
  let component: InvoicePosComponent;
  let fixture: ComponentFixture<InvoicePosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvoicePosComponent],
        imports: [
          BrowserAnimationsModule,
          ContractorsModule,
          CurrencyModule,
          DialogConfirmationsModule,
          HttpClientModule,
          MatCardModule,
          MatExpansionModule,
          MatFormFieldModule,
          MatInputModule,
          PaymentTermsModule,
          ReactiveFormsModule,
          ToastMakeModule,
        ],
        providers: [
          ContractorService,
          CurrencyCommonService,
          InvoiceCommonFunctionsService,
          InvoiceSellService,
          PaymentTermsService,
          ToastMakeService,
          TokenService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
