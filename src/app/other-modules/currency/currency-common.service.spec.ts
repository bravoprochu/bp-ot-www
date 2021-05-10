import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { TokenService } from "app/services/token.service";
import { CurrencyCommonService } from "./currency-common.service";

describe("CurrencyCommonService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CurrencyCommonService, TokenService],
    });
  });

  it("should be created", inject(
    [CurrencyCommonService],
    (service: CurrencyCommonService) => {
      expect(service).toBeTruthy();
    }
  ));
});
