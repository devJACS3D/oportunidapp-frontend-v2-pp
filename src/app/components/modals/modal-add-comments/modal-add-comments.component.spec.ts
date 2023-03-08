import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddCommentsComponent } from './modal-add-comments.component';

describe('ModalAddCommentsComponent', () => {
  let component: ModalAddCommentsComponent;
  let fixture: ComponentFixture<ModalAddCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
