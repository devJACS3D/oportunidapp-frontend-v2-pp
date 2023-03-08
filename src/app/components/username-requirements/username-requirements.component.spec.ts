import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameRequirementsComponent } from './username-requirements.component';

describe('UsernameRequirementsComponent', () => {
  let component: UsernameRequirementsComponent;
  let fixture: ComponentFixture<UsernameRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsernameRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
