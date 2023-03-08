import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'test-questions',
  templateUrl: './test-questions.component.html',
  styleUrls: ['./test-questions.component.scss']
})
export class TestQuestionsComponent implements OnInit {

  @Input('questionsFormGroup') questionsFormGroup:FormGroup;
  constructor() { }

  ngOnInit() {
  }

 get questions(){
   return this.questionsFormGroup.get('questions') as FormArray;
 }

}
