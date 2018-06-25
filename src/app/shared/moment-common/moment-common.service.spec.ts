import { TestBed, inject } from '@angular/core/testing';

import { MomentCommonService } from './moment-common.service';

describe('MomentCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MomentCommonService]
    });
  });

  it('should be created', inject([MomentCommonService], (service: MomentCommonService) => {
    expect(service).toBeTruthy();
  }));
});
