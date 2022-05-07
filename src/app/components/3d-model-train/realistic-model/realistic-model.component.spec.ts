import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisticModelComponent } from './realistic-model.component';

describe('RealisticModelComponent', () => {
  let component: RealisticModelComponent;
  let fixture: ComponentFixture<RealisticModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealisticModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealisticModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
