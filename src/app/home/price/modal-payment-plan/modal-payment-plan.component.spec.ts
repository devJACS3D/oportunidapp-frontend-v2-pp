import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaymentPlanComponent } from './modal-payment-plan.component';

describe('ModalPaymentPlanComponent', () => {
  let component: ModalPaymentPlanComponent;
  let fixture: ComponentFixture<ModalPaymentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaymentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaymentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
