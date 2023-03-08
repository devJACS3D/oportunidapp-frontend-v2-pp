import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCostComponent } from './form-cost.component';

describe('FormCostComponent', () => {
  let component: FormCostComponent;
  let fixture: ComponentFixture<FormCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
