import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '@apptypes/entities/IUser';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {

  @Input('user') user: IUser;
  private keys = [
    'firstName',
    'secondName',
    'lastName',
    'secondLastName',
    'identification',
    'city',
    'birthday',
    'maritalStatus',
    'credentialUser',
    'cellphone',
    'telephone',
    'availabilityTravel',
    'availabilityToRelocation',
    'peopleDiscapacity'
  ]
  utils = Utilities;
  constructor() { }

  ngOnInit() {
  }

  userHasInfo() {
    return this.keys.some(key => this.user[key]);
  }

}
