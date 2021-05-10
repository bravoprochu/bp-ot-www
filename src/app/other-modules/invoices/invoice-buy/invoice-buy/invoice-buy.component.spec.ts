import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { ToastMakeModule } from "app/other-modules/toast-make/toast-make.module";
import { ToastMakeService } from "app/other-modules/toast-make/toast-make.service";
import { TokenService } from "app/services/token.service";
import { InvoiceCommonFunctionsService } from "../../common/invoice-common-functions.service";
import { InvoiceBuyService } from "../services/invoice-buy.service";

import { InvoiceBuyComponent } from "./invoice-buy.component";

describe("InvoiceBuyComponent", () => {
  let component: InvoiceBuyComponent;
  let fixture: ComponentFixture<InvoiceBuyComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InvoiceBuyComponent],
        imports: [
          BrowserAnimationsModule,
          ContractorsModule,
          DialogConfirmationsModule,
          FormsModule,
          HttpClientModule,
          MatCheckboxModule,
          MatExpansionModule,
          MatFormFieldModule,
          MatInputModule,
          PaymentTermsModule,
          ReactiveFormsModule,
          ToastMakeModule,
          RouterModule.forRoot([]),
        ],
        providers: [
          ContractorService,
          CurrencyCommonService,
          InvoiceCommonFunctionsService,
          InvoiceBuyService,
          DialogConfirmationsService,
          PaymentTermsService,
          ToastMakeService,
          TokenService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
