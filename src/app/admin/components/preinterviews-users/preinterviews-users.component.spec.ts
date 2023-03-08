import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsUsersComponent } from './preinterviews-users.component';

describe('PreinterviewsUsersComponent', () => {
  let component: PreinterviewsUsersComponent;
  let fixture: ComponentFixture<PreinterviewsUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
