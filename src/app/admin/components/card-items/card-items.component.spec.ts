import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItemsComponent } from './card-items.component';

describe('CardItemsComponent', () => {
  let component: CardItemsComponent;
  let fixture: ComponentFixture<CardItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
