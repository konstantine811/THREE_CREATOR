import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaycasterPracticComponent } from './raycaster-practic.component';

describe('RaycasterPracticComponent', () => {
  let component: RaycasterPracticComponent;
  let fixture: ComponentFixture<RaycasterPracticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaycasterPracticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaycasterPracticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
