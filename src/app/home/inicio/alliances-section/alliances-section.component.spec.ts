import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlliancesSectionComponent } from './alliances-section.component';

describe('AlliancesSectionComponent', () => {
  let component: AlliancesSectionComponent;
  let fixture: ComponentFixture<AlliancesSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlliancesSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlliancesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
