import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQualificationsComponent } from './modal-qualifications.component';

describe('ModalQualificationsComponent', () => {
  let component: ModalQualificationsComponent;
  let fixture: ComponentFixture<ModalQualificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalQualificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQualificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
