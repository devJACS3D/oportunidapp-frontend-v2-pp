import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInterviewesComponent } from './user-interviewes.component';

describe('UserInterviewesComponent', () => {
  let component: UserInterviewesComponent;
  let fixture: ComponentFixture<UserInterviewesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInterviewesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInterviewesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
