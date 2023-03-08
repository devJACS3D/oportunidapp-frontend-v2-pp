import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsUsersListComponent } from './preinterviews-users-list.component';

describe('PreinterviewsUsersListComponent', () => {
  let component: PreinterviewsUsersListComponent;
  let fixture: ComponentFixture<PreinterviewsUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsUsersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
