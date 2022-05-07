import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderPatternComponent } from './shader-pattern.component';

describe('ShaderPatternComponent', () => {
  let component: ShaderPatternComponent;
  let fixture: ComponentFixture<ShaderPatternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShaderPatternComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShaderPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
