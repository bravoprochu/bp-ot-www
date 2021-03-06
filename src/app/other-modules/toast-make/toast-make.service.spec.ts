import { TestBed } from '@angular/core/testing';

import { ToastMakeService } from './toast-make.service';

describe('ToastMakeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToastMakeService = TestBed.get(ToastMakeService);
    expect(service).toBeTruthy();
  });
});
