import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTestsComponent } from './user-tests.component';

describe('UserTestsComponent', () => {
  let component: UserTestsComponent;
  let fixture: ComponentFixture<UserTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
