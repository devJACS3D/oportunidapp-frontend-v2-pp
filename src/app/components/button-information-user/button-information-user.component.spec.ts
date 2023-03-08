import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonInformationUserComponent } from './button-information-user.component';

describe('ButtonInformationUserComponent', () => {
  let component: ButtonInformationUserComponent;
  let fixture: ComponentFixture<ButtonInformationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonInformationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonInformationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
