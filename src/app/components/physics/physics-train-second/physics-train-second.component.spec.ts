import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsTrainSecondComponent } from './physics-train-second.component';

describe('PhysicsTrainSecondComponent', () => {
  let component: PhysicsTrainSecondComponent;
  let fixture: ComponentFixture<PhysicsTrainSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicsTrainSecondComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicsTrainSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
