import { TestBed } from '@angular/core/testing';

import { DataExportsService } from './data-exports.service';

describe('DataExportsService', () => {
  let service: DataExportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
