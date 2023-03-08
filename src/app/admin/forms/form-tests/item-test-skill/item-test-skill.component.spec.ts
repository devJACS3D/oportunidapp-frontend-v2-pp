import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTestSkillComponent } from './item-test-skill.component';

describe('ItemTestSkillComponent', () => {
  let component: ItemTestSkillComponent;
  let fixture: ComponentFixture<ItemTestSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTestSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemTestSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
