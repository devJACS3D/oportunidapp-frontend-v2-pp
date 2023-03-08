import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemBehaviorsComponent } from './item-behaviors.component';

describe('ItemBehaviorsComponent', () => {
  let component: ItemBehaviorsComponent;
  let fixture: ComponentFixture<ItemBehaviorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemBehaviorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemBehaviorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
