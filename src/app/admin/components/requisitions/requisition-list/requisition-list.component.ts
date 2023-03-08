import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiResponse, ApiResponseRecords } from "@apptypes/api-response";
import { IFilter } from "@apptypes/entities/IFilter";
import { IVacancy } from "@apptypes/entities/vacancy";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { map } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS } from "src/app/constants/constants";
import filters from "@utils/filterOpts";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { LoggedUser } from "@apptypes/types";
import { UserAccountService } from "@services/user-account.service";
import { LocalStorageService } from "@services/local-storage.service";
import { FilterType } from "@apptypes/enums/filterTypeEnum";

@Component({
  selector: "app-requisition-list",
  templateUrl: "./requisition-list.component.html",
  styleUrls: ["./requisition-list.component.scss"]
})
export class RequisitionListComponent implements OnInit {
  //component
  title: string;
  user: LoggedUser;
  AUTHORIZED = AUTHORIZED;
  private _requisitions: IVacancy[];
  filterParams: Object = {};
  private _pagination: IPagination;
  public currentPage: number = 1;
  public loadingPage: boolean;
  public itemsPerPage: number = 10;
  public utils = Utilities;

  private businessHeaders = [
    "Nombre",
    "Fecha de publicación",
    "Fecha de requisición",
    "Tipo de servicio",
    "Estado"
  ];
  private adminHeaders = [
    "Nombre empresa",
    "Sector",
    "Nombre vacante",
    "Lugar",
    "Fecha de creación",
    "Tipo de servicio"
  ];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _api: Api,
    private _alert: DialogService,
    private localStorage: LocalStorageService,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this._activatedRoute.data
      .pipe(map(res => res.requisitions))
      .subscribe((data: ApiResponseRecords<IVacancy>) => {
        this.filterParams = this.localStorage.getFilterItem(
          FilterType.requisitionFilters
        );
        this.user = this.userAccount.getUser();
        this.setTitle();
        this.requisitions = data.data;
        this.pagination = data;
      });
  }

  /* ................................................................................................. */
  /* SETTERS */
  /* ................................................................................................. */
  set requisitions(requisitions: IVacancy[]) {
    this._requisitions = requisitions;
  }
  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage
    };
  }
  setTitle() {
    this.title = this.user.isBusinessProfile
      ? "Requisición vacantes"
      : "Requisiciones";
    return this.title;
  }
  /* ................................................................................................. */
  /*  GETTERS */
  /* ................................................................................................. */
  get requisitions(): IVacancy[] {
    return this._requisitions;
  }
  get pagination(): any {
    return this._pagination;
  }

  get tableHeaders() {
    return this.user.isBusinessProfile
      ? this.businessHeaders
      : this.adminHeaders;
  }

  /* ................................................................................................. */
  /* FETCH DATA,FILTER, PAGE EVENTS */
  /* ................................................................................................. */
  private async fetchData(filters?: Object) {
    this.loadingPage = true;
    filters["published"] = 0; // 0 means false
    try {
      const strRequest = this.user.isBusinessProfile
        ? Entities.company_vacancies
        : Entities.vacancies;
      let data: ApiResponse = await this._api
        .get(strRequest, null, this.currentPage, this.itemsPerPage, filters)
        .toPromise();
      this.requisitions = data.response.data;
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
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    this.currentPage = event.pageNumber;
    this.itemsPerPage = event.itemsPerPage;
    this.fetchData(this.filterParams);
  }
  public applyFilters(filter: IFilter) {
    this.currentPage = 1;
    this.filterParams = filter.map;
    this.localStorage.setFilterItem(
      FilterType.requisitionFilters,
      this.filterParams
    );
    this.fetchData(this.filterParams);
  }
  /* ................................................................................................. */
  /* CREATE REQUISITION */
  /* ................................................................................................. */
  createRequisition() {
    this._router.navigate(["./create"], { relativeTo: this._activatedRoute });
  }

  async publishRequisition(requisition: IVacancy) {
    try {
      await this._api
        .put(`${Entities.vacancies}/publish`, {}, requisition.id)
        .toPromise();
      this.currentPage = 1;
      this.fetchData({});
      this.successAlert(
        `La vacante de la empresa ${requisition.company.name} fue publicada correctamente.`
      );
    } catch (error) {
      this.errorAlert(error);
    }
  }
  /* ................................................................................................. */
  /* filter opts */
  /* ................................................................................................. */
  get filterOpts() {
    if (this.user.isBusinessProfile) {
      return filters.requisitionBusinessFilters;
    }
    return filters.requisitionAdminFilters;
  }

  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this._alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }

  errorAlert(message: string) {
    this._alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }
}
