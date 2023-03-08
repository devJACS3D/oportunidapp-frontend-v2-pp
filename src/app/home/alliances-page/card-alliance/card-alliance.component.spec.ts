import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAllianceComponent } from './card-alliance.component';

describe('CardAllianceComponent', () => {
  let component: CardAllianceComponent;
  let fixture: ComponentFixture<CardAllianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAllianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAllianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
