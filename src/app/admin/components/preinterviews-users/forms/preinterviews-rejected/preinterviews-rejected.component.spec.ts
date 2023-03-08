import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsRejectedComponent } from './preinterviews-rejected.component';

describe('PreinterviewsRejectedComponent', () => {
  let component: PreinterviewsRejectedComponent;
  let fixture: ComponentFixture<PreinterviewsRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
