import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { ISkill } from '@apptypes/entities/skill';
import { ApiResponse, ApiResponseRecords } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';
import { IPagination } from '@apptypes/pagination';
import { AppSettings } from '@services/settings';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-behaviors',
  templateUrl: './behaviors.component.html',
  styleUrls: ['./behaviors.component.scss']
})
export class BehaviorsComponent implements OnInit {
  private entidad: string = Entities.skills;

  public _loading: boolean;
  public _loadingInit: boolean;
  public _loadingPage: boolean;
  public _error: string = '';

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: ISkill;


  public _result: ApiResponseRecords<any>;
  public _currentPage: number;
  public _ItemsPerPage: number;
  public _pagination: IPagination;

  public _loadingFilter: boolean;
  private FormFilter: FormGroup;
  public validFilterForm: boolean;
  private filterParams: any = null;

  index: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private alert: DialogService
  ) {
    this.index = null;
  }

  async ngOnInit() {
    this._loading = false;
    this._showConfirm = false;
    this._loadingInit = true;

    this._currentPage = this.activatedRoute.snapshot.params.page;
    this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

    if (!this._currentPage || !this._ItemsPerPage) {
      if (!this._currentPage)
        this.router.navigate([`./1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
      else
        this.router.navigate([`../1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
    } else {
      try {

        this.initForm();
        await this.loadData();
      } catch (err) {
        this._error = err;
      }

      this._loadingInit = false;
    }
  }

  private loadData(params?: Object) {
    return new Promise(async (resolve, reject) => {
      try {
        let resp: ApiResponse = await this.api.get(Entities.skills, null, this._currentPage, this._ItemsPerPage, params).toPromise();
        this._result = resp.response;

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
    })
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this._loadingPage = true;
    this._currentPage = event.pageNumber;
    await this.loadData(this.filterParams);
    this._loadingPage = false;
  }



  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public delete(Entity: ISkill) {
    this._confirmMessage = "¿Desea eliminar el registro de la competencia " + Entity.name + "?";
    this._showConfirm = true;
    this._EntityToDelete = Entity;
  }

  public async confirm($event) {
    if ($event) {
      this._loadingConfirm = true;

      try {
        let resp = await this.api.delete(this.entidad, this._EntityToDelete.id).toPromise() as ApiResponse;
        await this.loadData();

        this.alert.success(resp.message);

      } catch (err) {
        this.alert.error(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }



  /** Filter form */

  public async filter() {
    if (this.validFilterForm) {
      this.filterParams = this.checkValidForm();
      this._loadingFilter = true;
      this._loadingPage = true;

      try {
        this._currentPage = 1;
        let entityForm = JSON.parse(JSON.stringify(this.filterParams));
        await this.loadData(entityForm);

      } catch (err) {
        this.alert.error(err);
      }

      this._loadingPage = false;
      this._loadingFilter = false;
    }
  }

  private initForm() {
    let filter = { search: '' };
    filter = (this.filterParams) ? this.filterParams : filter;

    this.FormFilter = new FormGroup({
      search: new FormControl(filter.search)
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
  showBeh(index) {
    console.log(index);
    if (this.index === index) {
      this.index = null;
    } else {
      this.index = index;
    }
  }
  saveLocabeh(data){
    sessionStorage.setItem('saveLocabeh', JSON.stringify(data));
  }
}
