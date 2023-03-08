import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { ISkill } from '@apptypes/entities/skill';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-behaviour-list',
  templateUrl: './behaviour-list.component.html',
  styleUrls: ['./behaviour-list.component.scss']
})
export class BehaviourListComponent implements OnInit {

  //Component title
  public title = 'Conductas';
  //table data
  public tableHeaders = ['Competencia y/o habilidad'];
  public _skills: ISkill[];
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
  selectedSkill: ISkill;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _api: Api,
    private _alert: DialogService
  ) { }
  async ngOnInit() {
    this._activatedRoute.data.subscribe((data) => {
      console.log(data);
      this.skills = data.skills.data ? data.skills.data : [];
      this.pagination = data.skills;
    });
  }

  set skills(skills: ISkill[]) {
    this._skills = skills;
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
  get skills(): ISkill[] {
    return this._skills;
  }

  get pagination(): any {
    return this._pagination;
  }

  private async fetchData(filters?: Object) {
    this.loadingPage = true;
    try {
      let data: ApiResponse = await this._api.get(Entities.skills, null, this.currentPage, this.itemsPerPage, filters).toPromise();
      this.skills = data.response.data;
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
  public delete(skill: ISkill) {
    this.deleteText = "¿Desea eliminar el registro de la competencia " + skill.name + "?";
    this.showDeleteOpts = true;
    this.selectedSkill = skill;
  }

  public async onDeleteClose($event, justClose: boolean) {

    if (justClose) {
      this.showDeleteOpts = false;
      this.selectedSkill = null;
      return;
    }
    try {
      let resp = await this._api.delete(Entities.skills, this.selectedSkill.id).toPromise() as ApiResponse;
      this.fetchData();
      this._alert.success(resp.message);
    } catch (err) {
      this._alert.error(err);
    } finally {
      this.showDeleteOpts = false;
      this.selectedSkill = null;
    }

  }
}
