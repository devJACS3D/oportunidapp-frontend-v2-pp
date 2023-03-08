import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStudiesComponent } from './form-studies.component';

describe('FormStudiesComponent', () => {
  let component: FormStudiesComponent;
  let fixture: ComponentFixture<FormStudiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStudiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
