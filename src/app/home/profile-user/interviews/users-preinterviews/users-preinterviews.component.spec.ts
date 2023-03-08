import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPreinterviewsComponent } from './users-preinterviews.component';

describe('UsersPreinterviewsComponent', () => {
  let component: UsersPreinterviewsComponent;
  let fixture: ComponentFixture<UsersPreinterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersPreinterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPreinterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
