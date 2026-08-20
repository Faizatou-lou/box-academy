import { TestBed } from '@angular/core/testing';

import { Formations } from '../../pages/formations/formations';

describe('Formation', () => {
  let service: Formations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Formations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
