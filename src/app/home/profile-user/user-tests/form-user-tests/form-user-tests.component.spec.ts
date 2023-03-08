import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserTestsComponent } from './form-user-tests.component';

describe('FormUserTestsComponent', () => {
  let component: FormUserTestsComponent;
  let fixture: ComponentFixture<FormUserTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUserTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUserTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
