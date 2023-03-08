import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulatesComponent } from './postulates.component';

describe('PostulatesComponent', () => {
  let component: PostulatesComponent;
  let fixture: ComponentFixture<PostulatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostulatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
