import { HttpClientModule } from "@angular/common/http";
import { TestBed, inject } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TokenService } from "app/services/token.service";

import { InvoiceBuyService } from "./invoice-buy.service";

describe("InvoiceBuyService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      providers: [InvoiceBuyService, TokenService],
    });
  });

  it("should be created", inject(
    [InvoiceBuyService],
    (service: InvoiceBuyService) => {
      expect(service).toBeTruthy();
    }
  ));
});
