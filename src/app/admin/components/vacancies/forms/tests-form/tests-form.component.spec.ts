import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsFormComponent } from './tests-form.component';

describe('TestsFormComponent', () => {
  let component: TestsFormComponent;
  let fixture: ComponentFixture<TestsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
