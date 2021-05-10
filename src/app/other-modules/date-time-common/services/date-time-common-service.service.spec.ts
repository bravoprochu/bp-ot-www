import { TestBed } from '@angular/core/testing';

import { DateTimeCommonServiceService } from './date-time-common-service.service';

describe('DateTimeCommonServiceService', () => {
  let service: DateTimeCommonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateTimeCommonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
