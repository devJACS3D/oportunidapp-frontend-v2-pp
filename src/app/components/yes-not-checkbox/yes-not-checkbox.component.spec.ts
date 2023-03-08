import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNotCheckboxComponent } from './yes-not-checkbox.component';

describe('YesNotCheckboxComponent', () => {
  let component: YesNotCheckboxComponent;
  let fixture: ComponentFixture<YesNotCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNotCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNotCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
