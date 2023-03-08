import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, ApiResponseRecords } from '@apptypes/api-response';
import { ISector } from '@apptypes/entities/sector';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.scss']
})
export class SectorListComponent implements OnInit {

  //Component title
  public title = 'Sectores';
  //table data
  public tableHeaders = ['Nombre', 'Descripción general'];
  public _sectors: any[];
  //pagination
  public _pagination: IPagination;
  public itemsPerPage = 10;
  public currentPage = 1;
  public loadingPage: boolean;
  //filters
  filterParams: any = {}
  //utils
  utils = Utilities;
  //delete options
  showDeleteOpts: boolean;
  deleteText: string;
  selectedSector: ISector;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _api: Api,
    private _alert: DialogService
  ) { }
  async ngOnInit() {
    this._activatedRoute.data.
      pipe(
        map((response) => response.sectors)
      ).
      subscribe((sectors: ApiResponseRecords<ISector>) => {
        this.sectors = sectors.data ? sectors.data : [];
        this.pagination = sectors;
      });

  }

  set sectors(sectors: ISector[]) {
    this._sectors = sectors;
  }
  set pagination(pagination) {
    this._pagination = {
      pages: Utilities.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage
    }
  }
  get sectors(): ISector[] {
    return this._sectors;
  }

  get pagination(): any {
    return this._pagination;
  }

  private async fetchData(filters?: Object) {
    this.loadingPage = true;
    try {
      let data: ApiResponse = await this._api.get(Entities.sectors, null, this.currentPage, this.itemsPerPage, filters).toPromise();
      this.sectors = data.response.data;
      this.pagination = data.response;
      /*  this._error = null; */
    } catch (error) {
      console.log(error);
      /*  this._error = error; */
    } finally {
      this.loadingPage = false;
    }
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this.currentPage = event.pageNumber;
    this.itemsPerPage = event.itemsPerPage;
    this.fetchData(this.filterParams);
  }

  public applyFilters(filter) {
    this.currentPage = 1;

    this.filterParams = filter;
    this.fetchData(this.filterParams);
  }
  public delete(sector: ISector) {
    this.deleteText = "¿Seguro que desea eliminar el registro del sector seleccionado?";
    this.showDeleteOpts = true;
    this.selectedSector = sector;
  }

  public async onDeleteClose($event, justClose: boolean) {

    if (justClose) {
      this.showDeleteOpts = false;
      this.selectedSector = null;
      return;
    }
    try {
      let resp = await this._api.delete(Entities.sectors, this.selectedSector.id).toPromise() as ApiResponse;
      this.fetchData();
      this._alert.success(resp.message);
    } catch (err) {
      this._alert.error(err);
    } finally {
      this.showDeleteOpts = false;
      this.selectedSector = null;
    }

  }

  createSector() {
    this._router.navigate(['./create'], { relativeTo: this._activatedRoute })
  }
}
