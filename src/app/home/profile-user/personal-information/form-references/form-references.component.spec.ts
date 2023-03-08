import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReferencesComponent } from './form-references.component';

describe('PersonalInformationComponent', () => {
  let component: FormReferencesComponent;
  let fixture: ComponentFixture<FormReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
