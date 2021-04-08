import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { DialogConfirmationsModule } from "app/other-modules/dialog-confirmations/dialog-confirmations.module";
import { DialogConfirmationsService } from "app/other-modules/dialog-confirmations/services/dialog-confirmations.service";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { TokenService } from "app/services/token.service";
import { InvoiceCommonFunctionsService } from "./invoice-common-functions.service";

describe("InvoiceCommonFunctionsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogConfirmationsModule,
        HttpClientModule,
        MomentCommonModule,
        PaymentTermsModule,
        ContractorsModule,
      ],
      providers: [
        DialogConfirmationsService,
        MomentCommonService,
        PaymentTermsService,
        InvoiceCommonFunctionsService,
        CurrencyCommonService,
        ContractorService,
        TokenService,
      ],
    });
  });

  it("should be created", inject(
    [InvoiceCommonFunctionsService],
    (service: InvoiceCommonFunctionsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
