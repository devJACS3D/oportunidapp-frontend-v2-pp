import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesSectionComponent } from './vacancies-section.component';

describe('VacanciesSectionComponent', () => {
  let component: VacanciesSectionComponent;
  let fixture: ComponentFixture<VacanciesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacanciesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacanciesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
