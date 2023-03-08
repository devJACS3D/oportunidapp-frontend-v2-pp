import { Component, OnInit } from '@angular/core';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { AppSettings } from '@services/settings';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { IVacancy } from '@apptypes/entities/vacancy';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { FormGroup, FormControl } from '@angular/forms';
import { IState } from '@apptypes/entities/state';
import { ICity } from '@apptypes/entities/city';
import * as moment from 'moment';
import { RegexUtils } from '@utils/regex-utils';
import { ISector } from '@apptypes/entities/sector';
import { LocalStorageService } from '@services/local-storage.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  public maskCurrency: RegExp = RegexUtils._maskCurrency;

  public _loading: boolean;
  public _loadingInit: boolean;
  public _loadingPage: boolean;
  public _error: string = '' // error loading init;

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: any; //Crear modelo de Vacancy

  public _result: ApiResponseRecords<any>;
  public _currentPage: number;
  public _ItemsPerPage: number;
  public _pagination: IPagination;

  public _loadingCities: boolean;
  public _states: IState[] = [];
  public _cities: ICity[] = [];
  public _sectors: ISector[] = [];

  public _loadingFilter: boolean;
  private FormFilter: FormGroup;
  public _filterForm: boolean = false; // Show or hide filterForm
  public validFilterForm: boolean;
  private filterParams: any = null;
  public _maxDate: any;

  public currentUser: any;
  public _businessProfile: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private alert: DialogService,
    private storage: LocalStorageService
  ) { }

  async ngOnInit() {

    this.currentUser = this.api.getCurrentUser();
    this._businessProfile = (this.currentUser.userTypeId == 3) ? true : false;

    this._loading = false;
    this._showConfirm = false;
    this._loadingPage = false;

    this._loadingFilter = false;
    this._loadingCities = false;

    this._loadingInit = true;

    this._maxDate = Utilities.formatDate(moment().unix());

    this._currentPage = this.activatedRoute.snapshot.params.page;
    this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

    if (!this._currentPage || !this._ItemsPerPage) {
      if (!this._currentPage)
        this.router.navigate([`./1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
      else
        this.router.navigate([`../1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
    } else {
      // this.loadEntidades();

      try {
        let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
        this._states = stateResp.response.data;

        let secResp = await this.api.get(Entities.sectors, null, 1, 1000).toPromise();
        this._sectors = secResp.response.data;

        this.filterParams = this.storage.getParams('Admin', Entities.companies, 'filterParams');
        this.initForm();
        await this.loadData(this.filterParams);

      } catch (err) {
        this._error = err;
      }

      this._loadingInit = false;
    }
  }

  private loadData(params?: Object) {
    return new Promise(async (resolve, reject) => {
      try {
        let reqParams = (params) ? { ...params } : null;
        this.storage.setParams('Admin', Entities.companies, 'filterParams', params);
        let strRequest = (this._businessProfile) ? Entities.company_vacancies : Entities.companies;

        let resp: ApiResponse = await this.api.get(strRequest, null, this._currentPage, this._ItemsPerPage, reqParams).toPromise();
        this._result = resp.response;

        console.log('resp.response', resp.response);


        this.router.navigate(['./../../' + this._currentPage + '/' + this._ItemsPerPage], { relativeTo: this.activatedRoute });

        if (!this._result.data.length && this._result.elementsNumber > 0) {
          if (this._currentPage != this._result.pagesNumber) {
            this._currentPage = this._result.pagesNumber;

            await resolve(this.loadData());
          }
        }

        this._pagination = {
          pages: Utilities.recordPages(this._result.pagesNumber),
          pagesNumber: this._result.pagesNumber,
          elementsNumber: this._result.elementsNumber,
          itemsPerPage: this._ItemsPerPage,
          currentPage: this._currentPage
        }

        resolve(this._pagination);
      } catch (err) {
        reject(err);
      }
    });
  }

  public offerDetail(Entity: IVacancy) {
    // alert('view detail');
    this.router.navigate([`../../../detail-vacancies/${Entity.id}`], { relativeTo: this.activatedRoute });
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public delete(Entity: IVacancy) {
    this._confirmMessage = "¿Desea eliminar la vacante " + Entity.name + "?";
    this._showConfirm = true;
    this._EntityToDelete = Entity;
  }

  public async confirm($event) {
    if ($event) {
      this._loadingConfirm = true;

      try {
        let strRequest: string = (this._businessProfile) ? Entities.company_vacany : Entities.companies;
        let resp = await this.api.delete(strRequest, this._EntityToDelete.id).toPromise() as ApiResponse;

        // alert(resp.message);
        this.alert.success(resp.message);
        // this.loadEntidades();
        await this.loadData();

      } catch (err) {
        this.alert.error(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this._loadingPage = true;
    this._currentPage = event.pageNumber;
    await this.loadData(this.filterParams);
    this._loadingPage = false;
  }

  public async filter() {
    if (this.validFilterForm) {
      this.filterParams = this.checkValidForm();
      this._loadingFilter = true;
      this._loadingPage = true;

      try {
        this._currentPage = 1;

        let entityForm = JSON.parse(JSON.stringify(this.filterParams));
        if (entityForm.salary) entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary) //Establece el valor como númerico.
        if (entityForm.date) entityForm.date = Utilities.unixToDate(Utilities.unformatDate(entityForm.date));

        await this.loadData(entityForm);
        this._filterForm = false; // Ocultar panel de filtreo
      } catch (err) {
        this.alert.error(err);
      }

      this._loadingPage = false;
      this._loadingFilter = false;
    }
  }

  private initForm() {
    let filter = { vacanciesNameSearch: '', stateId: '', cityId: '', salary: '', sectorsNameSearch: '', date: '' };
    filter = (this.filterParams) ? this.filterParams : filter;

    this.FormFilter = new FormGroup({
      vacanciesNameSearch: new FormControl(filter.vacanciesNameSearch || ''),
      stateId: new FormControl(filter.stateId || ''),
      cityId: new FormControl(filter.cityId || ''),
      salary: new FormControl(filter.salary || ''),
      sectorsNameSearch: new FormControl(filter.sectorsNameSearch || ''),
      date: new FormControl(filter.date || '')
    });

    this.FormFilter.valueChanges.subscribe(() => {
      this.checkValidForm();
    });
  }

  private checkValidForm() {
    let body = this.FormFilter.value;
    let filterParams = {};
    for (let i in body) {
      if (body[i]) filterParams[i] = body[i];
    }
    this.validFilterForm = (Object.keys(filterParams).length) ? true : false;
    return filterParams;
  }

  public async clearFilter() {
    this._loadingPage = true;

    try {
      await this.loadData();
      Utilities.resetForm(this.FormFilter);
      this.filterParams = null;
    } catch (err) {
      this.alert.error(err);
    }

    this._loadingPage = false;
  }

  public async changeDepartment(event: any) {
    const departmentID = event.target.value;
    this._cities = [];
    this.FormFilter.controls.cityId.setValue("");

    if (departmentID != '' && departmentID != null && departmentID != undefined) {
      this._loadingCities = true;

      let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
      this._cities = citiesResp.response.data;
      this._loadingCities = false;
    }
  }

}
