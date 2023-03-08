import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredTestsComponent } from './registered-tests.component';

describe('RegisteredTestsComponent', () => {
  let component: RegisteredTestsComponent;
  let fixture: ComponentFixture<RegisteredTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
