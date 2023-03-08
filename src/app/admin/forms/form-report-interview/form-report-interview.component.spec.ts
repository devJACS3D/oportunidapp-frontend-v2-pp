import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportInterviewComponent } from './form-report-interview.component';

describe('FormReportInterviewComponent', () => {
  let component: FormReportInterviewComponent;
  let fixture: ComponentFixture<FormReportInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
