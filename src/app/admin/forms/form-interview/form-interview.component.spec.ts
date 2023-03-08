import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInterviewComponent } from './form-interview.component';

describe('FormInterviewComponent', () => {
  let component: FormInterviewComponent;
  let fixture: ComponentFixture<FormInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
