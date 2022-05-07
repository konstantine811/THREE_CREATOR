import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirsImplementGameComponent } from './firs-implement-game.component';

describe('FirsImplementGameComponent', () => {
  let component: FirsImplementGameComponent;
  let fixture: ComponentFixture<FirsImplementGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirsImplementGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirsImplementGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
