import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanComplementComponent } from './plan-complement.component';

describe('PlanComplementComponent', () => {
  let component: PlanComplementComponent;
  let fixture: ComponentFixture<PlanComplementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanComplementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
