import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSuccessStoriesComponent } from './carousel-success-stories.component';

describe('CarouselSuccessStoriesComponent', () => {
  let component: CarouselSuccessStoriesComponent;
  let fixture: ComponentFixture<CarouselSuccessStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselSuccessStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselSuccessStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
