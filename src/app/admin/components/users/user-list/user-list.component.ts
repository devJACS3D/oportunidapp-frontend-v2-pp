import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IFilterValues, IFilter } from '@apptypes/entities/IFilter';
import { IUser } from '@apptypes/entities/IUser';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import filters from '@utils/filterOpts';
import moment = require('moment');
import { UserTypes } from '@apptypes/enums/userTypes.enum';
import { AUTHORIZED } from '@apptypes/enums/authorized.enum';
import { LocalStorageService } from '@services/local-storage.service';
import { FilterType } from '@apptypes/enums/filterTypeEnum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  
  public Authorize = AUTHORIZED;
  
  public tableHeaders: string[] = ['', 'Nombre', 'Email', 'Tipo de usuario', 'Sector', 'Hojas de vida vistas', 'Disponibilidad', 'Verificación de disponibilidad']
  private entidad: string = Entities.administrators;

  public users: any[] = [];
  public _loading: boolean;
  public _loadingInit: boolean;
  public _loadingPage: boolean;
  public _error: boolean;

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  // public _EntityToDelete: IAdministrator;
  public _EntityToDelete: IUser;


  public _result: ApiResponseRecords<any>;
  public _currentPage: number = 1;
  public _ItemsPerPage: number = 10;
  public _pagination: IPagination;
  public filterParams: IFilterValues = {};
  public utils = Utilities

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    public localStorage:LocalStorageService,
    private alert: DialogService
  ) { }

  async ngOnInit() {
    this._loading = false;
    this._error = false;
    this._showConfirm = false;
    this._loadingInit = true;
    this._loadingPage = true;
    this.filterParams = this.localStorage.getFilterItem(FilterType.userFilters);
    await this.fetchData(this.filterParams);
    this._loadingInit = false;

  }

  private async fetchData(params?: Object) {
    this._loadingPage = true;
    try {
      let paginatedResponse: ApiResponse = await this.api.get(this.entidad, null, this._currentPage, this._ItemsPerPage, {...params, utype:UserTypes.AGENT}).toPromise();

      if (!params['yearsExperience'])
        this.users = paginatedResponse.response.data;
      else
        this.users = this.filterByYearsOfExperience(paginatedResponse.response.data, params['yearsExperience']);

      this._pagination = {
        pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
        pagesNumber: paginatedResponse.response.pagesNumber,
        elementsNumber: paginatedResponse.response.elementsNumber,
        itemsPerPage: this._ItemsPerPage,
        currentPage: this._currentPage
      }
      this._error = null;
    } catch (error) {
      console.log(error);
      this._error = error;
    } finally {
      this._loadingPage = false;
    }
  }

  filterByYearsOfExperience(data: any[], years?: number): any[] {
    return data.filter(user => {
      if (this.getYearsOfExperience(user.laboralExperiences) >= years) {
        return user;
      }
    });
  }

  private getYearsOfExperience(laboralExperiences: any[]) {
    const totalYears = laboralExperiences.reduce((reducer, current) => {
      return (reducer + moment(current.finishDate ? current.finishDate : new Date()).diff(current.startDate, 'years'));
    }, 0)
    return totalYears;
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this._loadingPage = true;
    this._currentPage = event.pageNumber;
    this._ItemsPerPage = event.itemsPerPage;
    await this.fetchData(this.filterParams);
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public delete(Entity: IUser) {
    this._confirmMessage = "¿Desea eliminar el usuario " + Entity.firstName + "?";
    this._showConfirm = true;
    this._EntityToDelete = Entity;
  }

  private getEntityUrl() {
    // 1: admin
    // 2: psicologo
    // 3 company
    // 4 business

    if (!this._EntityToDelete) return null;
    if (!this._EntityToDelete.userTypeId) return null;

    switch (this._EntityToDelete.userTypeId) {
      case 1:
      case 2:
        return Entities.administrators
      case 3:
        return Entities.companies

      default:
        return ''
    }
  }

  public async confirm($event: Event) {

    if ($event) {
      this._loadingConfirm = true;

      try {
        let resp = await this.api.delete(this.getEntityUrl(), this._EntityToDelete.credentialUser.id).toPromise() as ApiResponse;
        this.alert.success(resp.message);
        this.fetchData(this.filterParams);
      } catch (err) {
        alert(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  public createUser() {
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute })
  }


  public async applyFilters(filters: IFilter) {
    this.filterParams = filters.map;
    this.localStorage.setFilterItem(FilterType.userFilters,this.filterParams);
    this._currentPage = 1;
    await this.fetchData(this.filterParams);
  }

  /* ................................................................................................. */
  /* filter opts */
  /* ................................................................................................. */
  get filterOpts() {
    return filters.userFilters;
  }
}
