import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfComparativoComponent } from './inf-comparativo.component';

describe('InfComparativoComponent', () => {
  let component: InfComparativoComponent;
  let fixture: ComponentFixture<InfComparativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfComparativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
