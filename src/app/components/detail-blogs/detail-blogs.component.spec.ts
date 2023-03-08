import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailBlogsComponent } from './detail-blogs.component';

describe('DetailBlogsComponent', () => {
  let component: DetailBlogsComponent;
  let fixture: ComponentFixture<DetailBlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailBlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
