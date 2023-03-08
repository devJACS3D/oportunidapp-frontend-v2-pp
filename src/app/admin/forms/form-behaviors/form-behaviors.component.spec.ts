import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBehaviorsComponent } from './form-behaviors.component';

describe('FormBehaviorsComponent', () => {
  let component: FormBehaviorsComponent;
  let fixture: ComponentFixture<FormBehaviorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBehaviorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBehaviorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
