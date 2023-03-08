import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaiesLogisComponent } from './compaies-logis.component';

describe('CompaiesLogisComponent', () => {
  let component: CompaiesLogisComponent;
  let fixture: ComponentFixture<CompaiesLogisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaiesLogisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaiesLogisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
