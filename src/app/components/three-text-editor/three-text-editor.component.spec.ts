import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeTextEditorComponent } from './three-text-editor.component';

describe('ThreeTextEditorComponent', () => {
  let component: ThreeTextEditorComponent;
  let fixture: ComponentFixture<ThreeTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeTextEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
