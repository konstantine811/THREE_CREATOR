import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsEnable3dComponent } from './physics-enable3d.component';

describe('PhysicsEnable3dComponent', () => {
  let component: PhysicsEnable3dComponent;
  let fixture: ComponentFixture<PhysicsEnable3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicsEnable3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicsEnable3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
