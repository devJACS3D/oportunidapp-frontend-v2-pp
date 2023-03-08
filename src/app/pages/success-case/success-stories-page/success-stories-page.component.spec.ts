import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessStoriesPageComponent } from './success-stories-page.component';

describe('SuccessStoriesPageComponent', () => {
  let component: SuccessStoriesPageComponent;
  let fixture: ComponentFixture<SuccessStoriesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessStoriesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessStoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
