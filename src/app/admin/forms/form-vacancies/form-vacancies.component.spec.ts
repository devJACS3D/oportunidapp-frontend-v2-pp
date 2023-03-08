import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVacanciesComponent } from './form-vacancies.component';

describe('FormVacanciesComponent', () => {
  let component: FormVacanciesComponent;
  let fixture: ComponentFixture<FormVacanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormVacanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
