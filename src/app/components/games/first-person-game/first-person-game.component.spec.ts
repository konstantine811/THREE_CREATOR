import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPersonGameComponent } from './first-person-game.component';

describe('FirstPersonGameComponent', () => {
  let component: FirstPersonGameComponent;
  let fixture: ComponentFixture<FirstPersonGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPersonGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPersonGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
