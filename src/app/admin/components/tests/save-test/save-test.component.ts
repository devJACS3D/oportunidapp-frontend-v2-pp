import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { ITrainingPlan } from '@apptypes/entities/ITrainingPlan';
import { ITest } from '@apptypes/entities/test';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-save-test',
  templateUrl: './save-test.component.html',
  styleUrls: ['./save-test.component.scss']
})
export class SaveTestComponent implements OnInit {

  //component
  public title = 'Crear prueba';
  public isEditing: boolean;
  //test form
  testForm: FormGroup
  //submitting
  isSubmitting: boolean;
  private _questionsTest: FormArray;
  //training plans for feedbacks
  trainingPlans: ITrainingPlan[];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private _api: Api,
    private _alert: DialogService
  ) {

  }

  ngOnInit() {
    this._questionsTest = this.formBuilder.array([], this.validateSize);
    this._activatedRoute.data.
      pipe(map((res) => res.test))
      .subscribe((test: ITest) => {
        if (!test) {
          return this.initForm();
        }
        this.title = 'Actualizar prueba';
        this.isEditing = true;
        return this.patchForm(test);
      });
    this.getTrainingPlans();
  }

  initForm() {
    this.testForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      sectorId: [null, [Validators.required]],
      lastSkillAdded: [null],
      questionsTest: this._questionsTest
    })
  }

  patchForm(test: ITest) {
    this.testForm = this.formBuilder.group({
      name: [test.name, [Validators.required]],
      description: [test.description, [Validators.required]],
      testId: [test.id, [Validators.required]],
      sectorId: [test.sectorId, [Validators.required]],
      lastSkillAdded: [null],
      questionsTest: this.mapQuestionTest(test.questionstest)
    })
  }

  validateSize(arr: FormArray) {
    return arr.length < 4 ? {
      invalidSize: true
    } : null;
  }

  mapQuestionTest(questionTest: any[]) {
    questionTest.forEach(data => {
      this._questionsTest.push(this.formBuilder.group({
        id: data.id,
        skillId: data.skillId,
        skillName: data.skill.name,
        behaviourName: data.behavior.name,
        behaviorId: data.behavior.id,
        questions: this.mapArrayFromValues(data.questions),
        feedbacks: this.mapArrayFromJSONValues(data.feedbacks)
      }));
    });

    return this._questionsTest;
  }

  private mapArrayFromValues(data: any[]) {
    const formArray = this.formBuilder.array([]);
    data.forEach(data => {
      formArray.push(this.formBuilder.control(data, [Validators.required]));
    })
    return formArray;
  }

  private mapArrayFromJSONValues(data: any[]) {
    const formArray = this.formBuilder.array([]);
    data.forEach(data => {
      const value = JSON.parse(data);
      formArray.push(this.formBuilder.group({
        feedback: this.formBuilder.control(value.feedback, [Validators.required]),
        trainingPlanId: this.formBuilder.control(value.trainingPlanId)
      }));
    });
    return formArray;
  }

  get questionsTest() {
    return this.testForm.get('questionsTest') as FormArray;
  }

  removeQuestion(idx: number) {
    this.questionsTest.controls.splice(idx, 4);
  }

  public async getTrainingPlans() {
    try {
      let data: ApiResponse = await this._api.get(Entities.trainingPlans, null, 1, 1000).toPromise();
      this.trainingPlans = data.response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async handleSave() {
    this.isSubmitting = true;
    if (this.isEditing) {
      return this.update();
    }
    return this.save();
  }

  async save() {
    try {
      const response = await this._api.post(Entities.tests, this.testForm.value).toPromise()
      this._alert.success(response.message);
      this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    } catch (error) {
      console.log(error);
      this._alert.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
  async update() {
    try {
      const response = await this._api.put(Entities.tests, this.testForm.value, this.testForm.value.testId).toPromise()
      this._alert.success(response.message);
      this._router.navigate(['../../'], { relativeTo: this._activatedRoute });
    } catch (error) {
      console.log(error);
      this._alert.error(error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
