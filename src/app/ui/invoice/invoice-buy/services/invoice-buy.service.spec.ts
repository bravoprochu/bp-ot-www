import { TestBed, inject } from '@angular/core/testing';

import { InvoiceBuyService } from './invoice-buy.service';

describe('InvoiceBuyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceBuyService]
    });
  });

  it('should be created', inject([InvoiceBuyService], (service: InvoiceBuyService) => {
    expect(service).toBeTruthy();
  }));
});
