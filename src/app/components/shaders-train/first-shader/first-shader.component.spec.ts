import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstShaderComponent } from './first-shader.component';

describe('FirstShaderComponent', () => {
  let component: FirstShaderComponent;
  let fixture: ComponentFixture<FirstShaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstShaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstShaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
