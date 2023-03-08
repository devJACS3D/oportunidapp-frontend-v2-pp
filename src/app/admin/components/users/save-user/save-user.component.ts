import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '@apptypes/entities/IUser';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-save-user',
  templateUrl: './save-user.component.html',
  styleUrls: ['./save-user.component.scss']
})
export class SaveUserComponent implements OnInit {

  public title = 'Crear usuario';
  public file: File;
  public user: IUser;
  userForm: FormGroup;
  submitting$: Subject<boolean> = new Subject();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _api: Api,
    private _alert: DialogService,
  ) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe((data) => {
      this.user = data.user !== undefined ? data.user : this.setNewUser();

      if (this.user.id) this.title = 'Editar usuario';

      this.initForm(this.user);
    });
  }

  setNewUser(): IUser {
    return {
      id: null,
      firstName: null,
      lastName: null,
      credentialUser: { email: null, username: '' },
      userTypeId: null,
      identificationTypeId: null,
      identification: null,
      cityId: null
    }
  }

  public initForm(user?: IUser) {
    this.userForm = new FormGroup({
      name: new FormControl(this.getUserFullName(user), [Validators.required]),
      email: new FormControl(user.credentialUser.email, [Validators.required,
      Validators.pattern(RegexUtils._rxEmail),]),
      userTypeId: new FormControl(user.userTypeId, [Validators.required]),
      identificationTypeId: new FormControl(user.identificationTypeId, [Validators.required]),
      identification: new FormControl(user.identification, [
        Validators.required,
        Validators.pattern(RegexUtils._rxNumber)
      ]),
      cityId: new FormControl(user.cityId, [Validators.required]),
      username: new FormControl(user.credentialUser.username, [Validators.required]),
    });
  }

  private getUserFullName(user: IUser) {

    let fullName = null;;
    if (!user) return null;

    if (user.firstName !== null && user.firstName !== undefined)
      fullName = `${user.firstName}`

    if (user.lastName !== null && user.lastName !== undefined)
      fullName += ` ${user.lastName}`;
    return fullName;
  }

  public backTo() {
    if (this.user.id) {
      return '../../';
    } else {
      return '../'
    }
  }

  public async handleSave() {
    const userType = this.userForm.get('userTypeId').value;

    const payload = this.userForm.value;
    if (userType > 2) {
      return;
    }

    if (this.user.id) {
      return await this.updateUser(payload);
    }

    return await this.saveUser(payload);
  }

  private async saveUser(payload) {
    this.submitting$.next(true);
    try {
      const response = await this._api.post(Entities.administrators, payload).toPromise();
      this._alert.success(response.message);
      this._router.navigate(['../'],{relativeTo:this._activatedRoute});
    } catch (error) {
      console.log(error);
      this._alert.error(error);
    } finally {
      this.submitting$.next(false);
    }

  }
  private async updateUser(payload) {
    this.submitting$.next(true);
    try {
      const response = await this._api.putData(Entities.administrators, payload, this.user.id).toPromise();
      this._alert.success(response.message);
      this._router.navigate(['../../'],{relativeTo:this._activatedRoute});
    } catch (error) {
      console.log(error);
      this._alert.error(error);
    }finally{
    this.submitting$.next(false);
    }
  }
  public getFormData() {
    let formValues = this.userForm.value;
    let formData = Utilities.getFormData(formValues); // Convierte json to FormData;

    if (this.file) {
      formData.append('images', this.file);
    }
    return formData;
  }


}
