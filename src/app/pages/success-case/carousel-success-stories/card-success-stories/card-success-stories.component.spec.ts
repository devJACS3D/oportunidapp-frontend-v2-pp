import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSuccessStoriesComponent } from './card-success-stories.component';

describe('CardSuccessStoriesComponent', () => {
  let component: CardSuccessStoriesComponent;
  let fixture: ComponentFixture<CardSuccessStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSuccessStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSuccessStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
