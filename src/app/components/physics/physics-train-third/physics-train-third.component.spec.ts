import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsTrainThirdComponent } from './physics-train-third.component';

describe('PhysicsTrainThirdComponent', () => {
  let component: PhysicsTrainThirdComponent;
  let fixture: ComponentFixture<PhysicsTrainThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicsTrainThirdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicsTrainThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
