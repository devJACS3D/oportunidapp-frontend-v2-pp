import { Component, OnInit } from '@angular/core';
import { IPagination } from '@apptypes/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { IPreinterviews } from '@entities/preinterviews'
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';
import { MESSAGE } from 'src/app/constants/constants';

@Component({
  selector: 'app-preinterviews-list',
  templateUrl: './preinterviews-list.component.html',
  styleUrls: ['./preinterviews-list.component.scss']
})
export class PreinterviewsListComponent implements OnInit {
  public _pagination: IPagination;
  public _loadingPage: boolean;
  public _loadingSearch: boolean;
  public _showQuestions: boolean = false;
  public tableHeaders = ['Nombre de la Pre-Entrevista', 'Última edición', 'Acciones'];
  public _preinterviews: IPreinterviews[] = []
  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: any;
  public _currentPage: number = 1;
  public _ItemsPerPage: number = 10;
  public _error: any; // error loading init;
  public _textNotFound = MESSAGE.NOT_FOUND
  public errorLoadingData = MESSAGE.ERROR_LOADING_DATA
  public titlePage = `${MESSAGE.TEXT_CONFIG} ${MESSAGE.PRE_INTERVIEW}s`
  public textSearch = MESSAGE.TEXT_SEARCH
  public utils = Utilities;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private api: Api,
  ) { }

  async ngOnInit() {
    await this.fetchData()
  }


  public async fetchData(params?: Object) {
    // checking user type
    this._loadingPage = true;
    try {
      let paginatedResponse: ApiResponse = await this.api.get(Entities.preinterviews, null, this._currentPage, this._ItemsPerPage, params).toPromise();
      this._preinterviews = paginatedResponse.response.data;
      /* Compare if not data show message not found */
      if (params && !this._preinterviews.length) {
        this._textNotFound = MESSAGE.NOT_FOUND_SEARCH
      }
      // console.log(this._preinterviews);
      this._pagination = {
        pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
        pagesNumber: paginatedResponse.response.pagesNumber,
        elementsNumber: paginatedResponse.response.elementsNumber,
        itemsPerPage: this._ItemsPerPage,
        currentPage: this._currentPage
      }
      this._error = null;
    } catch (error) {
      // console.log(error);
      this._error = error;
    } finally {
      this._loadingPage = false;
    }
  }


  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this._ItemsPerPage = event.itemsPerPage;
    this._currentPage = event.pageNumber;
    await this.fetchData();
  }

  public createPreInterviews() {
    this.router.navigate([`form-preinterviews`], { relativeTo: this.activatedRoute });
  }

  public delete(Entity: any) {
    if (Entity.vacancies.length) {
      this.alert.error("La Pre Entrevista está siendo utilizada por una vacante.");
    } else {
      this._confirmMessage = "¿Desea eliminar la Pre Entrevista " + Entity.name + "?";
      this._showConfirm = true;
      this._EntityToDelete = Entity;
    }
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  /* Delete preinterview */
  public async confirm($event: Event) {
    if ($event) {
      this._loadingConfirm = true;
      try {
        let resp = await this.api.delete(Entities.preinterviews, this._EntityToDelete.id).toPromise() as ApiResponse;
        this.alert.success(resp.message);
        await this.fetchData();
      } catch (err) {
        this.alert.error(err);
      }
      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  /* Filter data from input search */
  async searchPreInterview(name: string) {
    this._loadingSearch = true
    const data = name !== "" && { name }
    this._currentPage = 1
    await this.fetchData(data);
    this._loadingSearch = false
  }

  /* Show modal questions */
  public showQuestions(preinterview: any) {
    const id = preinterview.id;
    this._showQuestions = true;
    this.router.navigate([`form-preinterviews/${id}`], { relativeTo: this.activatedRoute });
  }

}
