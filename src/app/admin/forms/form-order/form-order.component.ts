import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Api } from '@utils/api';
import { ActivatedRoute } from '@angular/router';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';
import * as moment from 'moment';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';


@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styleUrls: ['./form-order.component.scss']
})
export class FormOrderComponent implements OnInit {
  public _loadingForm: boolean;
  public _Entity: any;
  public _btnText: any;

  public _idEntity: any;
  public _vacancyId: any;

  public _formEntity: FormGroup;

  public _states: any;
  public _cities: any;

  public _minDate: any;

  public dateCurrent: any;

  public _resultCompanies: any
  _loadingCities: any;
  isOut: any;
  _loading: any;
  vacancy_data: any;

  constructor(private activatedRoute: ActivatedRoute,
    private api: Api,
    private alert: DialogService
  ) {


  }

  ngOnInit() {
    this.intiform();
    this._btnText = 'Guardar';

    this.dateCurrent = new Date().toISOString().slice(0, 10);;
    this._formEntity.controls.diligenceDate.setValue(this.dateCurrent);

    this._minDate = Utilities.formatDate(moment().unix());

    this._idEntity = this.activatedRoute.snapshot.params.id; // user id
    this._vacancyId = this.activatedRoute.snapshot.params.vacancyId;
    
    console.log('_vacancyId', this._vacancyId + '-' + this._idEntity);
    this.getData();
    this.laodState();
  }

  async laodState() {
    let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
    this._states = stateResp.response.data;
    this.getVacancy()
  }

  sendOrder() {
    // let contractDate = Utilities.formatDate(moment(this._Entity.contractDate).unix());
    let date: any;
    date = this._formEntity.get('admissionDate').value
    let body = {
      "userId": this._idEntity,
      "vacancyId": this._vacancyId,
      "diligenceDate": this.dateCurrent,
      "cityId": this._formEntity.get('cityId').value,
      "costCenter": this._formEntity.get('costCenter').value,
      "admissionDate": date.year + '-' + date.month + '-' + date.day,
      "paymentDate": 'SI',
      "salaryOrders": this.vacancy_data.salary,
      "bonuses": this._formEntity.get('bonuses').value,
      "others": this._formEntity.get('others').value,
      "branchOfficeId": this._formEntity.get('branchOfficeId').value
    };

    console.log('body', body);

    this.api.post('companies/entryOrder', body).subscribe((resp: ApiResponse) => {

      // alert(resp.message);
      this.alert.success(resp.message);
      //this.back();
    }, err => {
      //this._loading = false;
      this.alert.error(err);
    });

  }

  async getVacancy(){
    let vacancy = await this.api.get('administrator/vacancy/'+this._vacancyId, null, 1, 1000).toPromise();
    this.vacancy_data = vacancy.response
  }

  goBack() {

  }


  async intiform() {
    this._formEntity = new FormGroup({


      diligenceDate: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      costCenter: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      admissionDate: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),

      bonuses: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      others: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      cityId: new FormControl(null, [
        Validators.required,

      ]),
      branchOfficeId: new FormControl(null, [
        Validators.required,

      ]),

      stateId: new FormControl(null, [
        Validators.required,
      ]),
      identificacion: new FormControl(null, [
        Validators.required,
      ]),
      name: new FormControl(null, [
        Validators.required,
      ]),
      cargo: new FormControl(null, [
        Validators.required,
      ]),
      phone: new FormControl(null, [
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.required,
      ]),

    });

    let _department = this._formEntity.controls.stateId.value;
    if (_department != null && _department != undefined && _department != "" && _department != 0 && _department != "0") {
      //Cargar ciudades 


      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
      this._cities = citiesResp.response.data;
    }
  }

  /**
   * Obtener datos de vacate y el usuario apto para cargar en el fomulario
   */
  getData() {
    let dataVacancie: any;
    let dataUser: any;
    // Get Vacante
    this.api.get(Entities.vacancies, this._vacancyId).subscribe((resp: ApiResponse) => {
      this._loadingForm = false;
      console.log(resp.response);
      dataVacancie = resp.response;
      //Cargar datos necesario en formulario

      let contractDate = Utilities.formatDate(moment(dataVacancie.contractDate).unix());

      this._formEntity.controls.cargo.setValue(dataVacancie.name);

    }, err => {
      this._loadingForm = false;
      alert(err);
    });
    // Get User
    this.api.get("administrator/users/general/details", this._idEntity).subscribe((resp: ApiResponse) => {
      this._loadingForm = false;
      console.log(resp.response);
      dataUser = resp.response;
      //Cargar datos necesario en formulario

      this._formEntity.controls.name.setValue(dataUser.firstName + ' ' + dataUser.secondName + ' ' + dataUser.lastName + ' ' + dataUser.secondLastName);
      this._formEntity.controls.identificacion.setValue(dataUser.identification);
      this._formEntity.controls.email.setValue(dataUser.identification);
      this._formEntity.controls.phone.setValue(dataUser.telephone);

    }, err => {
      this._loadingForm = false;
      alert(err);
    });


    this.api.get(Entities.companieslogis, null, 1, 100).subscribe((resp: ApiResponse) => {
      this._loadingForm = false;
      console.log('sucursales', resp);
      this._resultCompanies = resp.response.data;
      //Cargar datos necesario en formulario

    }, err => {
      // this._loadingForm = false;
      alert(err);
    });




  }


  public async changeDepartment(event: any) {
    const departmentID = event.target.value;
    this._cities = [];
    this._formEntity.controls.cityId.setValue("");

    if (departmentID != '' && departmentID != null && departmentID != undefined) {

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
    }
  }

  submitForm() {
    if (this._formEntity.valid) {
      this.sendOrder();
    } else {
      Utilities.markAsDirty(this._formEntity);
    }

  }



}
