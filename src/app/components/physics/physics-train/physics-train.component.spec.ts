import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsTrainComponent } from './physics-train.component';

describe('PhysicsTrainComponent', () => {
  let component: PhysicsTrainComponent;
  let fixture: ComponentFixture<PhysicsTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicsTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicsTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
