import { Component, OnInit } from '@angular/core';
import { MESSAGE } from 'src/app/constants/constants';
import { ApiResponse } from '@apptypes/api-response';
import { IFilter, IFilterValues } from '@apptypes/entities/IFilter';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { Api } from '@utils/api';
import filters from '@utils/filterOpts';

@Component({
  selector: 'app-preinterviews-users-list',
  templateUrl: './preinterviews-users-list.component.html',
  styleUrls: ['./preinterviews-users-list.component.scss']
})
export class PreinterviewsUsersListComponent implements OnInit {

  public pagination: IPagination;
  public filterParams: IFilterValues = {};
  public titlePage = `${MESSAGE.PRE_INTERVIEW}s`
  public tableHeaders = ['', 'Nombre', 'Vacante', 'Estado'];
  public assetsPath: string = '../../../../../assets/actions/';
  public _error: boolean;
  public loadingPage: boolean;
  public _loadingInit: boolean;
  public showModalVideo: boolean = false
  public showModalReject: boolean = false
  public loadingData: boolean = false
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public statusId: number;
  public data: any[] = []
  public preinterviewsStatus: any;
  public currentUser: any;
  public utils = Utilities

  constructor(
    private api: Api
  ) { }

  //------------------------------------------------------------------------
  // Initialize component data
  //------------------------------------------------------------------------
  async ngOnInit() {
    this._loadingInit = true;
    this._error = false;
    await this.fetchData(this.filterParams);
    this._loadingInit = false;
  }
  //------------------------------------------------------------------------
  // Get the api information
  //------------------------------------------------------------------------
  private async fetchData(params?: Object) {
    this.loadingPage = true;
    try {
      let paginatedResponse: ApiResponse = await this.api.get(Entities.preinterviewsUsers, null, this.currentPage, this.itemsPerPage, params).toPromise();
      this.data = paginatedResponse.response.data;
      this.pagination = {
        pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
        pagesNumber: paginatedResponse.response.pagesNumber,
        elementsNumber: paginatedResponse.response.elementsNumber,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage
      }
      this._error = null;
    } catch (error) {
      console.log(error);
      this._error = error;
    } finally {
      this.loadingPage = false;
    }
  }
  //------------------------------------------------------------------------
  // Search by user filter
  //------------------------------------------------------------------------
  public async applyFilters(filters: IFilter) {
    this.filterParams = filters.map;
    this.currentPage = 1;
    await this.fetchData(this.filterParams);
  }
  //------------------------------------------------------------------------
  // Mark as seen by an admin
  //------------------------------------------------------------------------
  public async viewedBy(info: any) {
    if (!info.administratorId) {
      this.currentUser = this.api.getCurrentUser();
      try {
        const id = info.id
        const administratorId = this.currentUser.id
        await this.api.putData(Entities.preinterviewsUsers, { administratorId }, id).toPromise() as ApiResponse;
        this.fetchData()
      } catch (error) { }
    }
  }
  //------------------------------------------------------------------------
  // Show modal questions
  //------------------------------------------------------------------------
  public async showVideo(info: any) {
    this.preinterviewsStatus = info
    this.showModalVideo = true
    await this.viewedBy(info)
  }

  public onModalVideo(modalVideo: any) {
    if(modalVideo.close) this.showModalVideo = false
    if(modalVideo.refreshData){
      this.fetchData(this.filterParams)
      this.showModalVideo = false
    }
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.currentPage = event.pageNumber;
    await this.fetchData();
  }

  /* ................................................................................................. */
  /* FILTER SHOW OPTS */
  /* ................................................................................................. */
  get filterOpts() {
    return filters.userFilters;
  }
}
