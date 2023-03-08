import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdditionalsServicesComponent } from './form-additionals-services.component';

describe('FormAdditionalsServicesComponent', () => {
  let component: FormAdditionalsServicesComponent;
  let fixture: ComponentFixture<FormAdditionalsServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAdditionalsServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAdditionalsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
