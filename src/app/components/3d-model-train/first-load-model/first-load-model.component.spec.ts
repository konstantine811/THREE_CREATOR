import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoadModelComponent } from './first-load-model.component';

describe('FirstLoadModelComponent', () => {
  let component: FirstLoadModelComponent;
  let fixture: ComponentFixture<FirstLoadModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstLoadModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLoadModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
