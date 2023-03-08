import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSuccessStoriesComponent } from './form-success-stories.component';

describe('FormSuccessStoriesComponent', () => {
  let component: FormSuccessStoriesComponent;
  let fixture: ComponentFixture<FormSuccessStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSuccessStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSuccessStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
