import { TestBed, inject } from "@angular/core/testing";
import { MomentCommonModule } from "app/other-modules/moment-common/moment-common.module";
import { MomentCommonService } from "app/other-modules/moment-common/services/moment-common.service";

import { PaymentTermsService } from "./payment-terms.service";

describe("PaymentTermsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MomentCommonModule],
      providers: [PaymentTermsService, MomentCommonService],
    });
  });

  it("should be created", inject(
    [PaymentTermsService],
    (service: PaymentTermsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
