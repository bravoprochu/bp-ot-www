import { TestBed, inject } from '@angular/core/testing';

import { CommonUnitsService } from './common-units.service';

describe('CommonUnitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonUnitsService]
    });
  });

  it('should be created', inject([CommonUnitsService], (service: CommonUnitsService) => {
    expect(service).toBeTruthy();
  }));
});
