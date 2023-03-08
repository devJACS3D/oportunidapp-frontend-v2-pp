import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQuestionComponent } from './modal-question.component';

describe('ModalQuestionComponent', () => {
  let component: ModalQuestionComponent;
  let fixture: ComponentFixture<ModalQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
