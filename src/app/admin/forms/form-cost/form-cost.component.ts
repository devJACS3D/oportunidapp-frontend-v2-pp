import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { ApiResponse } from '@apptypes/api-response';
import { RegexUtils } from '@utils/regex-utils';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ICity } from '@apptypes/entities/city';
import { IState } from '@apptypes/entities/state';
import { IMembership } from '@apptypes/entities/membership';
import { ICost } from '@apptypes/entities/cost';
import { Utilities } from '@utils/utilities';
@Component({
  selector: 'app-form-cost',
  templateUrl: './form-cost.component.html',
  styleUrls: ['./form-cost.component.scss']
})
export class FormCostComponent implements OnInit {
  private entidad: string = Entities.cost;

  public rangoinvalid: boolean = false;
  public maskCurrency: RegExp = RegexUtils._maskCurrency;

  public _title: string;
  public _btnText: string;

  public _loading: boolean;
  public _loadingForm: boolean;

  public _formEntity: FormGroup;
  private _idEntity: number;
  public _Entity: ICost;

  public _cities: ICity[] = [];
  public _loadingCities: boolean;
  public _states: IState[] = [];

  ranges: Array<any>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private alert: DialogService
  ) {
    this.ranges = [];
    this._formEntity = new FormGroup({
      rangoInferior: new FormControl(null, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency),
        Validators.maxLength(10)
      ]),
      rangoSuperior: new FormControl(null, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency),
        Validators.maxLength(10)
      ]),
      rango1: new FormControl(null, [
        Validators.required,
        Validators.max(100)
      ]),
      rango2: new FormControl(null, [
        Validators.required,
        Validators.max(100)
      ]),
      rango3: new FormControl(null, [
        Validators.required,
        Validators.max(100)
      ]),
      rango4: new FormControl(null, [
        Validators.required,
        Validators.max(100)
      ]),


    });
  }

  async ngOnInit() {
    this._loading = false;
    this._loadingForm = true;

    this._idEntity = this.activatedRoute.snapshot.params.id;

    this.getRanges();

    if (this._idEntity) {
      // Edit Form
      this._title = 'Editar Costo';
      this._btnText = 'Actualizar';
      this.api.get(this.entidad, this._idEntity).subscribe((resp: ApiResponse) => {
        this._loadingForm = false;
        console.log(resp.response.registerDetails);

        this._Entity = resp.response.registerDetails;

        this.initForm();
      }, err => {
        this._loading = false;
        alert(err);
      });
    } else {
      // Create Form
      this._title = 'Crear Costo';
      this._btnText = 'Crear';

      this._Entity = {
        rangoInferior: null,
        rangoSuperior: null,
        rango1: null,
        rango2: null,
        rango3: null,
        rango4: null
      }
      this._loadingForm = false;
      this.initForm();
    }
    let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
    this._states = stateResp.response.data;
  }

  private async initForm() {
    console.log(this._Entity);
    this._formEntity = new FormGroup({
      rangoInferior: new FormControl(this._Entity.rangoInferior, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency),
        Validators.maxLength(11)
      ]),
      rangoSuperior: new FormControl(this._Entity.rangoSuperior, [
        Validators.required,
        Validators.pattern(RegexUtils._rxCurrency),
        Validators.maxLength(11),
      ]),
      rango1: new FormControl(this._Entity.rango1, [
        Validators.required,
        Validators.max(100),
      ]),
      rango2: new FormControl(this._Entity.rango2, [
        Validators.required,
        Validators.max(100)
      ]),
      rango3: new FormControl(this._Entity.rango3, [
        Validators.required,
        Validators.max(100)
      ]),
      rango4: new FormControl(this._Entity.rango4, [
        Validators.required,
        Validators.max(100)
      ]),


    });
  }


  public submitForm() {
    let formValue = this._formEntity.value;
    let rangoInferior;
    let rangoSuperior;
    rangoInferior = RegexUtils._unMaskCurrency(formValue.rangoInferior);
    rangoSuperior = RegexUtils._unMaskCurrency(formValue.rangoSuperior);

    if (rangoInferior > rangoSuperior) {
      // alert('El rango superior no puede ser mayor al inferior');
      this._loading = false;
      this.rangoinvalid = true;
      return
    } else {
      this.rangoinvalid = false;
      if (this.ranges != null) {

        this.ranges.forEach(element => {
          if (element.rangoInferior < rangoInferior && element.rangoSuperior >= rangoInferior) {
            this.rangoinvalid = true;
            this.alert.error('El rango inferior se encuentra en uno de los rangos registrados actualmente, verifique los rangos creados para crear uno nuevo.');
            return
          }
        });
      }
    }

    if (this._formEntity.valid && this.rangoinvalid == false) {
      this._loading = true;

      formValue.rangoInferior = RegexUtils._unMaskCurrency(formValue.rangoInferior);
      formValue.rangoSuperior = RegexUtils._unMaskCurrency(formValue.rangoSuperior);

      let body = { ...formValue, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt };
      console.log('body', body);

      if (this._idEntity) {
        // Edit Form
        this.api.put(this.entidad, body, this._idEntity).subscribe((resp: ApiResponse) => {
          this._loading = false;

          // alert(resp.message);
          this.alert.success(resp.message);
          this.back();
        }, err => {
          this._loading = false;
          alert(err);
        });
      } else {
        // Create Form
        console.log('formValue', formValue);

        this.api.post(this.entidad, formValue).subscribe((resp: ApiResponse) => {
          this._loading = false;

          // alert(resp.message);
          this.alert.success(resp.message);
          this.back();
        }, err => {
          this._loading = false;
          alert(err);
        });
      }

    } else {
      Utilities.markAsDirty(this._formEntity);

      // alert('Campos vacios o inválidos. Por favor complete información correctamente.');
    }
  }

  async getRanges(params?: Object) {
    let resp: ApiResponse = await this.api.get(Entities.cost, null, null, 20, params).toPromise();
    this.ranges = resp.response.data;
    console.log('resp cost', resp);
  }

  public back() {
    this.router.navigate(['admin/cost']);
  }

  public async changeDepartment(event: any) {
    const departmentID = event.target.value;
    this._cities = [];
    this._formEntity.controls.cityId.setValue("");

    if (departmentID != '' && departmentID != null && departmentID != undefined) {
      this._loadingCities = true;

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }
  }

  public close() {
    if (this._idEntity) {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
  }
}

