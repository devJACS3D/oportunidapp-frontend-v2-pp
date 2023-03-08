import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulantComponent } from './postulant.component';

describe('PostulantComponent', () => {
  let component: PostulantComponent;
  let fixture: ComponentFixture<PostulantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostulantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostulantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
