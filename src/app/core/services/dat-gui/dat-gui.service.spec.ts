import { TestBed } from '@angular/core/testing';

import { DatGuiService } from './dat-gui.service';

describe('DatGuiService', () => {
  let service: DatGuiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatGuiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
