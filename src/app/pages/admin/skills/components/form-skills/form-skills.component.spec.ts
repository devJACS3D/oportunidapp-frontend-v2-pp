import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSkillsComponent } from './form-skills.component';

describe('FormSkillsComponent', () => {
  let component: FormSkillsComponent;
  let fixture: ComponentFixture<FormSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
