import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TokenService } from "app/services/token.service";

import { InvoicesPaymentStatusService } from "./invoices-payment-status.service";

describe("InvoicesPaymentStatusService", () => {
  let service: InvoicesPaymentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule],
      providers: [InvoicesPaymentStatusService, TokenService],
    });
    service = TestBed.inject(InvoicesPaymentStatusService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
