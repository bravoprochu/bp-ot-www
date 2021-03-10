import { TestBed } from '@angular/core/testing';

import { InvoicesPaymentStatusService } from './invoices-payment-status.service';

describe('InvoicesPaymentStatusService', () => {
  let service: InvoicesPaymentStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicesPaymentStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
