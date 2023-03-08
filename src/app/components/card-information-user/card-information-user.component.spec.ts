import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInformationUserComponent } from './card-information-user.component';

describe('CardInformationUserComponent', () => {
  let component: CardInformationUserComponent;
  let fixture: ComponentFixture<CardInformationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInformationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInformationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
