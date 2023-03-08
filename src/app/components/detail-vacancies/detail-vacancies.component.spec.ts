import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVacanciesComponent } from './detail-vacancies.component';

describe('DetailVacanciesComponent', () => {
  let component: DetailVacanciesComponent;
  let fixture: ComponentFixture<DetailVacanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailVacanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailVacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
