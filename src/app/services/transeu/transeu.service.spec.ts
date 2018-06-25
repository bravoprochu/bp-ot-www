import { TestBed, inject } from '@angular/core/testing';

import { TranseuService } from './transeu.service';

describe('TranseuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranseuService]
    });
  });

  it('should be created', inject([TranseuService], (service: TranseuService) => {
    expect(service).toBeTruthy();
  }));
});
