import { TestBed } from '@angular/core/testing';

import { IsBusinessGuard } from './is-business.guard';

describe('IsBusinessGuard', () => {
  let guard: IsBusinessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsBusinessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
