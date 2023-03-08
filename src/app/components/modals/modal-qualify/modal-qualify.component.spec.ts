import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQualifyComponent } from './modal-qualify.component';

describe('ModalQualifyComponent', () => {
  let component: ModalQualifyComponent;
  let fixture: ComponentFixture<ModalQualifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQualifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQualifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
