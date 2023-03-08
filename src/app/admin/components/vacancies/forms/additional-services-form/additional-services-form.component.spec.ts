import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalServicesFormComponent } from './additional-services-form.component';

describe('AdditionalServicesFormComponent', () => {
  let component: AdditionalServicesFormComponent;
  let fixture: ComponentFixture<AdditionalServicesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalServicesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
