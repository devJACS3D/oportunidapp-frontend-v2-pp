import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ITrainingPlan } from '@apptypes/entities/ITrainingPlan';

@Component({
  selector: 'test-feedbacks',
  templateUrl: './test-feedbacks.component.html',
  styleUrls: ['./test-feedbacks.component.scss']
})
export class TestFeedbacksComponent implements OnInit {

  @Input('feedbacksFormGroup') feedbacksFormGroup: FormGroup;
  @Input('trainingPlans') trainingPlans: ITrainingPlan[];
  constructor() { }

  ngOnInit() {
  }

  get feedbacks() {
    return this.feedbacksFormGroup.get('feedbacks') as FormArray;
  }

}
