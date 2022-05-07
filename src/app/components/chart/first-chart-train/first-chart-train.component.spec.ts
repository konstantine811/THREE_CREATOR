import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstChartTrainComponent } from './first-chart-train.component';

describe('FirstChartTrainComponent', () => {
  let component: FirstChartTrainComponent;
  let fixture: ComponentFixture<FirstChartTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstChartTrainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstChartTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
