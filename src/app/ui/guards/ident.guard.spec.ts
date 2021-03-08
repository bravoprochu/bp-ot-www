import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { IdentGuard } from './ident.guard';

describe('IdentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IdentGuard]
    });
  });

  it('should ...', inject([IdentGuard], (guard: IdentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
