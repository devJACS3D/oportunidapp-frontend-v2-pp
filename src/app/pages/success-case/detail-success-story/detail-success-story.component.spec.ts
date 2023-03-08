import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSuccessStoryComponent } from './detail-success-story.component';

describe('DetailSuccessStoryComponent', () => {
  let component: DetailSuccessStoryComponent;
  let fixture: ComponentFixture<DetailSuccessStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSuccessStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSuccessStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
