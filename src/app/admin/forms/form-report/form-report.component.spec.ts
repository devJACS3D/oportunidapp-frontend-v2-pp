import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReportComponent } from './form-report.component';

describe('FormReportComponent', () => {
  let component: FormReportComponent;
  let fixture: ComponentFixture<FormReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
