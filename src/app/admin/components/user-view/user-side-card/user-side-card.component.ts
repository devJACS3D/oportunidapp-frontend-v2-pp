import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '@apptypes/entities/IUser';
import { AUTHORIZED } from '@apptypes/enums/authorized.enum';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-side-card',
  templateUrl: './user-side-card.component.html',
  styleUrls: ['./user-side-card.component.scss']
})
export class UserSideCardComponent implements OnInit {

  AUTHORIZED = AUTHORIZED;
  @Input('user') user: IUser;
  utils = Utilities;
  constructor() { }

  ngOnInit() {
  }

  getFullName() {
    let fullName = this.user.firstName;
    if (this.user.secondName) {
      fullName += ` ${this.user.secondName}`;
    }
    if (this.user.lastName) {
      fullName += ` ${this.user.lastName}`;
    }
    return fullName;
  }

}
