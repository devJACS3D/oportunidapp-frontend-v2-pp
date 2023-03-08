import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserLogisComponent } from './form-user-logis.component';

describe('FormUserLogisComponent', () => {
  let component: FormUserLogisComponent;
  let fixture: ComponentFixture<FormUserLogisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUserLogisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserLogisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
