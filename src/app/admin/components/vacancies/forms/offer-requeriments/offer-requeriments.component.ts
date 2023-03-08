import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { IDrivingLicense } from '@apptypes/entities/driving-license';
import { IEducationalLevel } from '@apptypes/entities/educational-level';
import { AUTHORIZED } from '@apptypes/enums/authorized.enum';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { RegexUtils } from '@utils/regex-utils';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'offer-requeriments',
  templateUrl: './offer-requeriments.component.html',
  styleUrls: ['./offer-requeriments.component.scss']
})
export class OfferRequerimentsComponent implements OnInit {
  AUTHORIZED = AUTHORIZED;
  @Input('formGroup') formGroup: FormGroup;
  @Output('onError') onError: EventEmitter<any> = new EventEmitter();
  public maskNumber: RegExp = RegexUtils._maskNumber;
  $educationalLevels: Observable<IEducationalLevel[]>;
  $drivingLicenses: Observable<IDrivingLicense[]>;
  constructor(
    private _api: Api
  ) { }

  ngOnInit() {
    this.getEducationalLevels();
    this.getDrivingLicenses();
  }

  public get maxAge() {
    let formMax = this.formGroup.controls.maximunAge.value;
    return (formMax) ? formMax : 99;
  }

  private getEducationalLevels() {
    this.$educationalLevels = this._api.get(Entities.educationalLevels, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data
      }), catchError(err => {
        this.onError.emit(err);
        throw (err);
      }));
  }

  private getDrivingLicenses() {
    this.$drivingLicenses = this._api.get(Entities.drivingLicenses, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data
      }), catchError(err => {
        this.onError.emit(err);
        throw (err);
      }));
  }

  setRequirement($event,controlName:string){

    const checked = $event.target.checked;

    if(checked){
      this.formGroup.get(controlName).setValue(true);
    }else{
      this.formGroup.get(controlName).setValue(false);
    }
    console.log(this.formGroup.value);
  }

  compareRequirement(controlName: string){
  }

  public getAvailableRequirements() {
    return [
      { name: 'Ciudad', controlName: 'requiredCity' },
      { name: 'Jornada laboral', controlName: 'requiredWorkday' },
      { name: 'Idioma', controlName: 'requiredLanguage' },
      { name: 'Educación', controlName: 'requiredEducation' },
      { name: 'Años de experiencia', controlName: 'requiredYearsOfExperience' },
      { name: 'Rango salarial', controlName: 'requiredSalary' },
      { name: 'Rango de edad', controlName: 'requiredAge' },
      { name: 'Licencia de conducción', controlName: 'requiredDrivingLicense' },
      { name: 'Disponibilidad para viajar', controlName: 'requiredAvailabilityToTravel' },
      { name: 'Disponibilidad de reubicación', controlName: 'requiredAvailabilityToRelocation' },
      { name: 'Con dispacacidad', controlName: 'requiredPeopleDiscapacity' },
    ]
  }

  get minMaxAgeErrors(){
    return {
      minMaxAge:"La edad mínima no puede ser mayor a la edad máxima."
    }
  }
}
