import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompaniesLogisComponent } from './form-companies-logis.component';

describe('FormCompaniesLogisComponent', () => {
  let component: FormCompaniesLogisComponent;
  let fixture: ComponentFixture<FormCompaniesLogisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCompaniesLogisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCompaniesLogisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
