import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedTestsComponent } from './finished-tests.component';

describe('FinishedTestsComponent', () => {
  let component: FinishedTestsComponent;
  let fixture: ComponentFixture<FinishedTestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedTestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
