import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAdditionalsServicesComponent } from './detail-additionals-services.component';

describe('DetailAdditionalsServicesComponent', () => {
  let component: DetailAdditionalsServicesComponent;
  let fixture: ComponentFixture<DetailAdditionalsServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAdditionalsServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAdditionalsServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
