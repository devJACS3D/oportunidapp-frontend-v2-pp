import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '@apptypes/entities/IUser';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-additional-data',
  templateUrl: './additional-data.component.html',
  styleUrls: ['./additional-data.component.scss']
})
export class AdditionalDataComponent implements OnInit {

  @Input('user') user: IUser;
  private keys = [
    'usersSectors',
    'languages',
    'workday',
    'minimumSalary',
    'maxSalary',
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'dependents',
    'availabilityTravel',
    'authorizeCompanyData',
    'placeIdentificationCity',
    'identificationIssueDate',
    'militaryCardNumber',
    'bloodTypes',
    'placeResidenceCity',
    'district',
    'stratum',
    'housingType',
    'height',
    'weight',
  ]
  utils = Utilities;
  constructor() { }

  ngOnInit() {
  }

  userHasAdditionalInfo() {
    return this.keys.some(key => this.user[key] !== undefined);
  }

}
