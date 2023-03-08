import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVacanciesComponent } from './user-vacancies.component';

describe('UserVacanciesComponent', () => {
  let component: UserVacanciesComponent;
  let fixture: ComponentFixture<UserVacanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserVacanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
