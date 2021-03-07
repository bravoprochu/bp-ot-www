import { TestBed, inject } from '@angular/core/testing';

import { CurrencyCommonService } from './currency-common.service';

describe('CurrencyCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyCommonService]
    });
  });

  it('should be created', inject([CurrencyCommonService], (service: CurrencyCommonService) => {
    expect(service).toBeTruthy();
  }));
});
