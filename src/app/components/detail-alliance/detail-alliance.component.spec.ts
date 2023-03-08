import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAllianceComponent } from './detail-alliance.component';

describe('DetailAllianceComponent', () => {
  let component: DetailAllianceComponent;
  let fixture: ComponentFixture<DetailAllianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAllianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAllianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
