import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCurriculumVitaeComponent } from './modal-curriculum-vitae.component';

describe('ModalCurriculumVitaeComponent', () => {
  let component: ModalCurriculumVitaeComponent;
  let fixture: ComponentFixture<ModalCurriculumVitaeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCurriculumVitaeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCurriculumVitaeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
