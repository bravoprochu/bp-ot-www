import { TestBed } from '@angular/core/testing';

import { DialogConfirmationsService } from './dialog-confirmations.service';

describe('DialogConfirmationsService', () => {
  let service: DialogConfirmationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogConfirmationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
