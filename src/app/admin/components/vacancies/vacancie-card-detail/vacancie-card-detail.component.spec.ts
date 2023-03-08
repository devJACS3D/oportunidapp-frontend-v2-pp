import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancieCardDetailComponent } from './vacancie-card-detail.component';

describe('VacancieCardDetailComponent', () => {
  let component: VacancieCardDetailComponent;
  let fixture: ComponentFixture<VacancieCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacancieCardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancieCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
