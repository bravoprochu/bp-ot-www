import { TestBed, inject } from '@angular/core/testing';

import { CommonFunctionsService } from './common-functions.service';

describe('CommonFunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonFunctionsService]
    });
  });

  it('should be created', inject([CommonFunctionsService], (service: CommonFunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
