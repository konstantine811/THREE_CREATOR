import { TestBed } from '@angular/core/testing';

import { InitThreeSceneService } from './init-three-scene.service';

describe('InitThreeSceneService', () => {
  let service: InitThreeSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitThreeSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
