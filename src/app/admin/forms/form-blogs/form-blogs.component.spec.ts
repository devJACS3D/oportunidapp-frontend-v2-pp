import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBlogsComponent } from './form-blogs.component';

describe('FormBlogsComponent', () => {
  let component: FormBlogsComponent;
  let fixture: ComponentFixture<FormBlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
