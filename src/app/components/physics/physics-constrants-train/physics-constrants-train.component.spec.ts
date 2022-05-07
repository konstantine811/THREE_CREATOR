import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsConstrantsTrainComponent } from './physics-constrants-train.component';

describe('PhysicsConstrantsTrainComponent', () => {
  let component: PhysicsConstrantsTrainComponent;
  let fixture: ComponentFixture<PhysicsConstrantsTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicsConstrantsTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicsConstrantsTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
