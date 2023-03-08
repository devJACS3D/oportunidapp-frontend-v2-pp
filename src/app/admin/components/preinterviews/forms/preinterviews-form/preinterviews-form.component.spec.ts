import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinterviewsFormComponent } from './preinterviews-form.component';

describe('PreinterviewsFormComponent', () => {
  let component: PreinterviewsFormComponent;
  let fixture: ComponentFixture<PreinterviewsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreinterviewsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreinterviewsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
