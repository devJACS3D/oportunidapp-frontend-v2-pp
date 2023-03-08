import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISector } from '@apptypes/entities/sector';
import { ISkill } from '@apptypes/entities/skill';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'test-general-aspects',
  templateUrl: './test-general-aspects.component.html',
  styleUrls: ['./test-general-aspects.component.scss']
})
export class TestGeneralAspectsComponent implements OnInit {

  @Input('testForm') testForm: FormGroup;
  sectors$: Observable<ISector>
  skills$: Observable<ISkill>
  constructor(
    private _api: Api,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.sectors$ = this._api.get(Entities.sectors, null, 1, 1000).pipe(map((res) => res.response.data))
    this.skills$ = this._api.get(Entities.skills, null, 1, 1000).pipe(map((res) => res.response.data))
    this.watchSkillChanges();
  }

  watchSkillChanges() {
    this.testForm.get('lastSkillAdded').valueChanges.subscribe(data => this.addTestQuestion(data));
  }

  addTestQuestion(data: ISkill) {

    if (this.findOneQuestion(data.id))
      return;


    const questionsTest = this.testForm.get('questionsTest') as FormArray;
    data.behaviors.forEach(behaviour => {
      questionsTest.push(this.formBuilder.group({
        skillId: data.id,
        skillName: data.name,
        behaviourName: behaviour.name,
        behaviorId: behaviour.id,
        questions: this.pushQuestions(),
        feedbacks: this.pushFeedBacks()
      }));
    })
  }

  private findOneQuestion(predicate: number) {
    const questionsTest = this.testForm.get('questionsTest') as FormArray;
    return questionsTest.controls.find(data => data.value.skillId == predicate);
  }

  private pushQuestions() {
    return this.formBuilder.array([
      [null, [Validators.required]],
      [null, [Validators.required]],
      [null, [Validators.required]],
      [null, [Validators.required]],
      [null, [Validators.required]],
    ]
    );
  }
  private pushFeedBacks() {
    return this.formBuilder.array(
      [
        //feedback 1
        this.formBuilder.group({
          feedback: this.formBuilder.control(null, Validators.required),
          trainingPlanId: this.formBuilder.control(1)
        }),
        //feedback 2
        this.formBuilder.group({
          feedback: this.formBuilder.control(null, Validators.required),
          trainingPlanId: this.formBuilder.control(1)
        }),
        //feedback 3
        this.formBuilder.group({
          feedback: this.formBuilder.control(null, Validators.required),
          trainingPlanId: this.formBuilder.control(1)
        }),
        //feedback 4
        this.formBuilder.group({
          feedback: this.formBuilder.control(null, Validators.required),
          trainingPlanId: this.formBuilder.control(1)
        }),
      ]
    );
  }

}
