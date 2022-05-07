import { TestBed } from '@angular/core/testing';

import { CannonInitService } from './cannon-init.service';

describe('CannonInitService', () => {
  let service: CannonInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CannonInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
