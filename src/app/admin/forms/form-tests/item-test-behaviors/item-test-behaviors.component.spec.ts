import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTestBehaviorsComponent } from './item-test-behaviors.component';

describe('ItemTestBehaviorsComponent', () => {
  let component: ItemTestBehaviorsComponent;
  let fixture: ComponentFixture<ItemTestBehaviorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTestBehaviorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTestBehaviorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
