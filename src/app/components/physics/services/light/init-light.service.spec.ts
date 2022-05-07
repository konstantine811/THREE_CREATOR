import { TestBed } from '@angular/core/testing';

import { InitLightService } from './init-light.service';

describe('InitLightService', () => {
  let service: InitLightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitLightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
