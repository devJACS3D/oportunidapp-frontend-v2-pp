import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { IUserType } from '@apptypes/entities/user-type';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input('formGroup') userForm: FormGroup;
  /* Observables */
  $cities: Observable<ApiResponse>;
  $userTypes: Observable<ApiResponse>;
  $idTypes: Observable<ApiResponse>;
  $companies: Observable<ApiResponse>;
  $serviceTypes: Observable<ApiResponse>;
  $sectors: Observable<ApiResponse>;

  constructor(
    private _api: Api
  ) { }

  ngOnInit() {
    this.loadObservables();
  }


  private loadObservables() {
    this.$cities = this._api.get(Entities.cities, null, 1, 1000).pipe(
      map((res: ApiResponse) => res.response.data)
    );

    this.$userTypes = this._api.get(Entities.userTypes, null, 1, 1000).pipe(
      map((res) => res.response.data.filter(d => d.id == 1 || d.id == 2))
    );

    this.$idTypes = this._api.get(Entities.identificationTypes, null, 1, 1000).pipe(
      map((res: ApiResponse) => res.response.data)
    );
    this.$companies = this._api.get(Entities.companies, null, 1, 1000).pipe(
      map((res: ApiResponse) => res.response.data)
    );
    this.$serviceTypes = this._api.get(Entities.serviceTypes, null, 1, 1000).pipe(
      map((res: ApiResponse) => res.response.data)
    );
    this.$sectors = this._api.get(Entities.sectors, null, 1, 1000).pipe(
      map((res: ApiResponse) => res.response.data)
    );
  }

  public getFormControlValue(control: string) {
    return this.userForm.get(control).value;
  }

  handleSelectChange({ name, value }) {
    this.userForm.get(name).setValue(value);
  }

}
