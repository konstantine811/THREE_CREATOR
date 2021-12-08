import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeConstructorComponent } from './three-constructor.component';

describe('ThreeConstructorComponent', () => {
  let component: ThreeConstructorComponent;
  let fixture: ComponentFixture<ThreeConstructorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeConstructorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeConstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
