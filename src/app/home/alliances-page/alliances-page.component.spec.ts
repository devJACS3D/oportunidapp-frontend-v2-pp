import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlliancesPageComponent } from './alliances-page.component';

describe('AlliancesPageComponent', () => {
  let component: AlliancesPageComponent;
  let fixture: ComponentFixture<AlliancesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlliancesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlliancesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
