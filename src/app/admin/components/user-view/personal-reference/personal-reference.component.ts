import { Component, Input, OnInit } from '@angular/core';
import { IPersonalReference } from '@apptypes/entities/personalReference';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-personal-reference',
  templateUrl: './personal-reference.component.html',
  styleUrls: ['./personal-reference.component.scss']
})
export class PersonalReferenceComponent implements OnInit {

  @Input('personalReferences') personalReferences: IPersonalReference[];
  utils = Utilities;
  constructor() { }

  ngOnInit() {
  }

}
