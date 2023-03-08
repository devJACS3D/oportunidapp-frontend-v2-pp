import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferRequerimentsComponent } from './offer-requeriments.component';

describe('OfferRequerimentsComponent', () => {
  let component: OfferRequerimentsComponent;
  let fixture: ComponentFixture<OfferRequerimentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferRequerimentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferRequerimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
