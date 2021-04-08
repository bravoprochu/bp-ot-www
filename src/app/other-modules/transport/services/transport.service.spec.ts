import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { ContractorsModule } from "app/other-modules/contractors/contractors.module";
import { ContractorService } from "app/other-modules/contractors/services/contractor.service";
import { CurrencyCommonService } from "app/other-modules/currency/currency-common.service";
import { CurrencyModule } from "app/other-modules/currency/currency.module";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";
import { PaymentTermsModule } from "app/other-modules/payment-terms/payment-terms.module";
import { PaymentTermsService } from "app/other-modules/payment-terms/services/payment-terms.service";
import { TokenService } from "app/services/token.service";

import { TransportService } from "./transport.service";

describe("TransportService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MomentCommonModule,
        CurrencyModule,
        ContractorsModule,
        PaymentTermsModule,
      ],
      providers: [
        TransportService,
        TokenService,
        MomentCommonService,
        CurrencyCommonService,
        ContractorService,
        PaymentTermsService,
      ],
    });
  });

  it("should be created", inject(
    [TransportService],
    (service: TransportService) => {
      expect(service).toBeTruthy();
    }
  ));
});
