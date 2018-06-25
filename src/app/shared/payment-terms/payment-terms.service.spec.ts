import { TestBed, inject } from '@angular/core/testing';

import { PaymentTermsService } from './payment-terms.service';

describe('PaymentTermsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTermsService]
    });
  });

  it('should be created', inject([PaymentTermsService], (service: PaymentTermsService) => {
    expect(service).toBeTruthy();
  }));
});
