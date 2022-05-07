import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSturcturingComponent } from './code-sturcturing.component';

describe('CodeSturcturingComponent', () => {
  let component: CodeSturcturingComponent;
  let fixture: ComponentFixture<CodeSturcturingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeSturcturingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSturcturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
