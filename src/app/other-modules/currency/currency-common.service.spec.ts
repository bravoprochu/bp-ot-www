import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { TokenService } from "app/services/token.service";
import { MomentCommonModule } from "../moment-common/moment-common.module";
import { MomentCommonService } from "../moment-common/services/moment-common.service";
import { CurrencyCommonService } from "./currency-common.service";

describe("CurrencyCommonService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MomentCommonModule],
      providers: [CurrencyCommonService, MomentCommonService, TokenService],
    });
  });

  it("should be created", inject(
    [CurrencyCommonService],
    (service: CurrencyCommonService) => {
      expect(service).toBeTruthy();
    }
  ));
});
