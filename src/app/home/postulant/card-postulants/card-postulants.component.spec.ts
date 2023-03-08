import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPostulantsComponent } from './card-postulants.component';

describe('CardPostulantsComponent', () => {
  let component: CardPostulantsComponent;
  let fixture: ComponentFixture<CardPostulantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPostulantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPostulantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
