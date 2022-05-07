import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalaxyGeneratorComponent } from './galaxy-generator.component';

describe('GalaxyGeneratorComponent', () => {
  let component: GalaxyGeneratorComponent;
  let fixture: ComponentFixture<GalaxyGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalaxyGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalaxyGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
