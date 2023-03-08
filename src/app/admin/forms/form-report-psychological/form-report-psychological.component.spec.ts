import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportPsychologicalComponent } from './form-report-psychological.component';

describe('FormReportPsychologicalComponent', () => {
  let component: FormReportPsychologicalComponent;
  let fixture: ComponentFixture<FormReportPsychologicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportPsychologicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportPsychologicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
