import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsApprovedComponent } from './preinterviews-approved.component';

describe('PreinterviewsApprovedComponent', () => {
  let component: PreinterviewsApprovedComponent;
  let fixture: ComponentFixture<PreinterviewsApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
