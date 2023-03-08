import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsVideoComponent } from './preinterviews-video.component';

describe('PreinterviewsVideoComponent', () => {
  let component: PreinterviewsVideoComponent;
  let fixture: ComponentFixture<PreinterviewsVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
