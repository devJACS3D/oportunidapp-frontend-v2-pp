import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ISkill } from '@apptypes/entities/skill';
import { ItemTestSkillComponent } from '../../form-tests/item-test-skill/item-test-skill.component';

@Component({
  selector: 'app-item-behaviors',
  templateUrl: './item-behaviors.component.html',
  styleUrls: ['./item-behaviors.component.scss']
})
export class ItemBehaviorsComponent implements OnInit {

  @Input()
  public index: number;

  @Input()
  public item: FormGroup;

  @Output()
  public removed: EventEmitter<number> = new EventEmitter<number>();

  public static skill: ISkill;

  get skillName(): string {
    return ItemTestSkillComponent.skill.name;
  }

  public isCollapsed = false;

  constructor() {
  }

  ngOnInit() {
  }

  static buildToEdit(item: any, skill: any) {
    return new FormGroup({
      id: new FormControl(item.id),
      skillId: new FormControl(skill.id, [Validators.required]),
      skillName: new FormControl(skill.name, Validators.required),

      question_1: new FormControl(item.question_1, [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_2: new FormControl(item.question_2, [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_3: new FormControl(item.question_3, [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_4: new FormControl(item.question_4, [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_5: new FormControl(item.question_5, [
        Validators.required,
        Validators.maxLength(200)
      ]),
      feedback_1: new FormControl(item.feedback_1, [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_2: new FormControl(item.feedback_2, [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_3: new FormControl(item.feedback_3, [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_4: new FormControl(item.feedback_4, [
        Validators.required,
        Validators.maxLength(500)
      ])
    });
  }

  static buildItem(skill: ISkill) {
    this.skill = skill;

    return new FormGroup({
      skillId: new FormControl(0, [Validators.required]),
      skillName: new FormControl('item.name', Validators.required),
      question_1: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_2: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_3: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_4: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      question_5: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      feedback_1: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_2: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_3: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ]),
      feedback_4: new FormControl('', [
        Validators.required,
        Validators.maxLength(500)
      ])
    })
  }
}
