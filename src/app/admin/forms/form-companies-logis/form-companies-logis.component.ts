import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { ApiResponse } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { IPagination } from '@apptypes/pagination';
import { ICity } from '@apptypes/entities/city';
import { IState } from '@apptypes/entities/state';
import { RegexUtils } from '@utils/regex-utils';


@Component({
  selector: 'app-form-companies-logis',
  templateUrl: './form-companies-logis.component.html',
  styleUrls: ['./form-companies-logis.component.scss']
})
export class FormCompaniesLogisComponent implements OnInit {
  public _title: string;
  public _btnText: string;

  public _titleUser: string;
  public _btnTextUser: string;

  public _loadingForm: boolean;
  public FormEntity: FormGroup;
  public _formEntityUser: FormGroup;

  private _idEntity: number;
  public _error: string = '';
  public _loading: boolean;
  public _Entity: any;
  public _EntityUser: any;
  public _businessProfile: boolean = false;
  public postCreateCompany: boolean = false;
  public _Users: any;

  public _currentPage: number;
  public _ItemsPerPage: number;
  public _pagination: IPagination;

  public _cities: ICity[] = [];
  public _loadingCities: boolean;
  public _states: IState[] = [];

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: any;

  public _resultCompanies: any;

  public postCreateEditUser: boolean = false;
  public idEditUser: any;
  constructor(
    private api: Api,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService
  ) {
    this._Users = [];
    this._EntityUser = [];
    this._resultCompanies = [];
  }

  async ngOnInit() {
    this._loading = false;
    this._loadingForm = true;
    this._EntityUser = {};

    this.loadstate();

    this._idEntity = this.activatedRoute.snapshot.params.id;
    console.log(' this._idEntity', this._idEntity);

    // Cargar sucursales
    let resp: ApiResponse = await this.api.get(Entities.companieslogis, null, 1, 1000).toPromise();
    this._resultCompanies = resp.response.data;

    try {
      // Edit form
      if (this._idEntity) {
        this._title = 'Editar Empresa del grupo';
        this._btnText = 'Actualizar';
        this.postCreateCompany = true;

        let resp: ApiResponse = await this.api.get(Entities.companieslogis, this._idEntity).toPromise();
        this._Entity = resp.response.registerDetails;
        console.log('companies', this._Entity);
        this.getUsersBySuc(this._idEntity);
        this.initForm();

      } else {
        // Create form
        this._title = 'Crear Empresa del grupo';
        this._btnText = 'Guardar';

        let stateResp = await this.api.get(Entities.companies, null, 1, 1000).toPromise();
        this._Entity = stateResp.response.data;
        console.log('companies Create', this._Entity);
        this.initForm();

      }

    } catch (err) {
      this._error = err;

    }
    this._loadingForm = false;

    let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
    this._states = stateResp.response.data;
  }

  private async initForm() {
    this.FormEntity = new FormGroup({
      name: new FormControl(this._Entity.name, [
        Validators.required,
        Validators.maxLength(100)
      ])
    });
  }

  private async initFormUser(item?) {
    console.log();

    this._formEntityUser = new FormGroup({
      id: new FormControl(this._EntityUser.id),
      fullname: new FormControl(this._EntityUser.fullname, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      email: new FormControl(this._EntityUser.email, [
        Validators.required,
        Validators.pattern(RegexUtils._rxEmail),
        Validators.maxLength(100)
      ]),
      stateId: new FormControl(this._EntityUser.stateId, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      cityId: new FormControl(this._EntityUser.cityId, [
        Validators.required,
        Validators.maxLength(100)
      ]),
      branchOfficeId: new FormControl(this._EntityUser.branchOfficeId, [
        Validators.required,
        Validators.maxLength(100)
      ]),
    });

    if (item && item.id) {
      const departmentID = item.stateId;
      this._formEntityUser.controls.cityId.setValue(item.cityId);
      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }
  }
  /**
   * Editar un usuario de sucursal
   * @param id 
   */
  async editUserSuc(id) {
    console.log('id', id);

    if (id) {
      // edit form
      this._titleUser = 'Editar de sucursal';
      this._btnTextUser = 'Actualizar';

      let resp: ApiResponse = await this.api.get(Entities.companieslogis, null, 1, 1000).toPromise();
      this._resultCompanies = resp.response.data;

      console.log('_resultCompanies', this._resultCompanies);


      this.postCreateEditUser = true;

      let res: ApiResponse = await this.api.get(Entities.companieslogisUser, id).toPromise();
      let _Users = res.response;
      this._EntityUser = _Users.registerDetails;
      // this._Users = _Users;

      this.initFormUser(this._EntityUser);
      console.log('getUser', this._EntityUser);
    }
  }
  /**
   * Crear usuario de una sucursal
   */
  submitUser() {
    let formValue: any;
    formValue = this._formEntityUser.value;
    console.log('formValue', formValue);

    if (this._formEntityUser.valid) {
      if (this._formEntityUser.value) {
        if (formValue.id !== null) {
          // edit form
          this._titleUser = 'Editar de sucursal';
          this._btnTextUser = 'Actualizar';

          if (this.FormEntity.valid) {

            let body = { ...formValue, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt };
            this.api.put(Entities.companieslogisUser, body, formValue.id).subscribe((resp: ApiResponse) => {
              this._loading = false;

              this.getUsersBySuc(this.activatedRoute.snapshot.params.id);
              this.postCreateEditUser = false
              // alert(resp.message);
              this.alert.success(resp.message);
              this._formEntityUser.reset();


            }, err => {
              this._loading = false;
              // alert(err);
              this.alert.error(err);

            });
          }
        } else {
          // create form
          if (this._formEntityUser.valid) {
            this._titleUser = 'Crear nuevo usuario de sucursal';
            this._btnTextUser = 'Guardar';

            delete formValue.id;

            this.api.post(Entities.companieslogisUser, formValue).subscribe((resp: ApiResponse) => {
              this._loading = false;
              this.postCreateCompany = true;

              console.log(resp.response.id);
              this.idEditUser = resp.response.id;
              this._title = 'Editar Empresa del grupo';
              this._btnText = 'Actualizar';

              this.getUsersBySuc(this.activatedRoute.snapshot.params.id);

              this.postCreateEditUser = false;

              // alert(resp.message);
              this.alert.success(resp.message);
              this._formEntityUser.reset();

            }, err => {
              this._loading = false;
              // alert(err);
              this.alert.error(err);
            });
          }
        }
      }

    } else {
      Utilities.markAsDirty(this._formEntityUser);

    }

  }
  /**
   * Crear sucursar empresa
   */
  submitForm() {
    let formValue = this.FormEntity.value;
    if (this._idEntity) {
      // Edit Form
      if (this.FormEntity.valid) {

        let body = { ...formValue, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt };
        this.api.put(Entities.companieslogis, body, this._idEntity).subscribe((resp: ApiResponse) => {
          this._loading = false;

          this.getUsersBySuc(this.activatedRoute.snapshot.params.id);

          // alert(resp.message);
          this.alert.success(resp.message);
          this.back();
        }, err => {
          this._loading = false;
          // alert(err);
          this.alert.error(err);
        });
      }
    } else {
      // Create Form
      this.api.post(Entities.companieslogis, formValue).subscribe((resp: ApiResponse) => {
        this._loading = false;
        this.postCreateCompany = true;

        console.log(resp.response.id);
        this._idEntity = resp.response.id;
        this._title = 'Editar Empresa del grupo';
        this._btnText = 'Actualizar';

        // alert(resp.message);
        this.alert.success(resp.message);
      }, err => {
        this._loading = false;
        // alert(err);
        this.alert.error(err);
      });

    }
    //Obtener usuarios asociados a la sucursal
    this.getUsersBySuc(this.activatedRoute.snapshot.params.id);

  }


  /**
   * get usur por id
   * @param id 
   */
  async getUser(id) {
    let res: ApiResponse = await this.api.get(Entities.companieslogisUser, id).toPromise();
    this._Users = res.response;
    console.log('getUser', this._Users);
  }

  /**
   * get usuarios por sucursal
   * @param id 
   */
  async getUsersBySuc(id) {
    // /administrator/CRUD/branchOfficeUser?pageNumber=1&elementsNumber=1000&branchOfficeId=3
    let params = {
      branchOfficeId: id
    }
    let resp: ApiResponse = await this.api.get(Entities.companieslogisUser, null, 1, 1000, { branchOfficeId: id }).toPromise();
    this._Users = resp.response.data;
    console.log('resp getUsersBySuc', resp);
  }

  public back() {
    this.router.navigate(['/admin/companies/1/9']);
  }

  public goback() {
    // this.location.back();
    if (this._idEntity) {
      this.router.navigate(['/admin/companies/1/9'], { relativeTo: this.activatedRoute })
    } else {
      this.router.navigate(['/admin/companies/1/9'], { relativeTo: this.activatedRoute })
    }
  }
  /**
   * Eleimiar usuario 
   * @param Entity 
   */
  public delete(Entity: any) {
    this._confirmMessage = "¿Desea eliminar el usuario " + Entity.fullname;
    this._showConfirm = true;
    this._EntityToDelete = Entity;
  }

  /***
   * Aleta de confirmacion 
   */
  public async confirm($event) {
    if ($event) {
      this._loadingConfirm = true;

      try {
        let resp = await this.api.delete(Entities.companieslogisUser, this._EntityToDelete.id).toPromise() as ApiResponse;
        // await this.loadData();
        this.getUsersBySuc(this.activatedRoute.snapshot.params.id);
        this.alert.success(resp.message);

      } catch (err) {
        this.alert.error(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  public async changeDepartment(event: any) {
    const departmentID = event.target.value;
    this._cities = [];
    this._formEntityUser.controls.cityId.setValue("");

    if (departmentID != '' && departmentID != null && departmentID != undefined) {
      this._loadingCities = true;

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }
  }

  showCreateEditUser(id?) {



    this._titleUser = 'Crear nuevo usuario de sucursal';
    this._btnTextUser = 'Guardar';
    if (id) {
      this.idEditUser = id;
    }
    this.initFormUser();
    this.postCreateEditUser = true;
    this.loadstate();

  }


  async loadstate() {
    let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
    this._states = stateResp.response.data;
    console.log('_states', this._states);
  }
}
