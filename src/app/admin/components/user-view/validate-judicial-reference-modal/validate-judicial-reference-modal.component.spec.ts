import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateJudicialReferenceModalComponent } from './validate-judicial-reference-modal.component';

describe('ValidateJudicialReferenceModalComponent', () => {
  let component: ValidateJudicialReferenceModalComponent;
  let fixture: ComponentFixture<ValidateJudicialReferenceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateJudicialReferenceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateJudicialReferenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
