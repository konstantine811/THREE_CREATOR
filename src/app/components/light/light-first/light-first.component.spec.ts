import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightFirstComponent } from './light-first.component';

describe('LightFirstComponent', () => {
  let component: LightFirstComponent;
  let fixture: ComponentFixture<LightFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightFirstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
