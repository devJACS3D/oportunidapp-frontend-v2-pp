import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersInterviewsComponent } from './users-interviews.component';

describe('UsersInterviewsComponent', () => {
  let component: UsersInterviewsComponent;
  let fixture: ComponentFixture<UsersInterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersInterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
