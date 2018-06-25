import { TestBed, inject } from '@angular/core/testing';

import { InvoiceCommonFunctionsService } from './invoice-common-functions.service';

describe('InvoiceCommonFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceCommonFunctionsService]
    });
  });

  it('should be created', inject([InvoiceCommonFunctionsService], (service: InvoiceCommonFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
