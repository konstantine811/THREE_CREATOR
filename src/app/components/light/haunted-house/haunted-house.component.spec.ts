import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HauntedHouseComponent } from './haunted-house.component';

describe('HauntedHouseComponent', () => {
  let component: HauntedHouseComponent;
  let fixture: ComponentFixture<HauntedHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HauntedHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HauntedHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
