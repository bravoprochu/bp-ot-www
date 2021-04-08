import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { CommonFunctionsService } from "app/services/common-functions.service";
import { TokenService } from "app/services/token.service";
import { of } from "rxjs";
import { LoadService } from "../services/load.service";

import { LoadComponent } from "./load.component";

describe("LoadComponent", () => {
  let component: LoadComponent;
  let fixture: ComponentFixture<LoadComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoadComponent],
        imports: [
          ContractorsModule,
          CurrencyModule,
          PaymentTermsModule,
          HttpClientModule,
          MatSnackBarModule,
          ReactiveFormsModule,
          RouterModule.forRoot([]),
        ],
        providers: [
          LoadService,
          CommonFunctionsService,
          CurrencyCommonService,
          PaymentTermsService,
          TokenService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
