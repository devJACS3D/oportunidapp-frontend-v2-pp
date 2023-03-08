import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiewPostulantComponent } from './user-wiew-postulant.component';

describe('UserWiewPostulantComponent', () => {
  let component: UserWiewPostulantComponent;
  let fixture: ComponentFixture<UserWiewPostulantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWiewPostulantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiewPostulantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
