import { TestBed, inject } from '@angular/core/testing';

import { AppErrorHandlerService } from './app-error-handler.service';

describe('AppErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppErrorHandlerService]
    });
  });

  it('should be created', inject([AppErrorHandlerService], (service: AppErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
