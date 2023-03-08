import { Component, Input, OnInit } from '@angular/core';
import { IAcademicTitlesUser } from '@apptypes/entities/IAcademicTitle';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-academic-information',
  templateUrl: './academic-information.component.html',
  styleUrls: ['./academic-information.component.scss']
})
export class AcademicInformationComponent implements OnInit {
  util = Utilities;
  @Input('academicInformation') academicInformation: IAcademicTitlesUser[];
  constructor() { }

  ngOnInit() {
  }
}
