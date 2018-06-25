import { TestBed, inject } from '@angular/core/testing';

import { DataFactoryService } from './data-factory.service';

describe('DataFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataFactoryService]
    });
  });

  it('should be created', inject([DataFactoryService], (service: DataFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
