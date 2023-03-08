import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ISkill } from '@apptypes/entities/skill';
import { IBehaviour } from '@apptypes/entities/test';

@Component({
  selector: 'behaviour-form',
  templateUrl: './behaviour-form.component.html',
  styleUrls: ['./behaviour-form.component.scss']
})
export class BehaviourFormComponent implements OnInit {

  @Input('behaviours') behaviours: FormArray;
  constructor() { }

  ngOnInit() {
    console.log(this.behaviours);
  }



}
