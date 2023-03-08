import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsComponent } from './preinterviews.component';

describe('PreinterviewsComponent', () => {
  let component: PreinterviewsComponent;
  let fixture: ComponentFixture<PreinterviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
