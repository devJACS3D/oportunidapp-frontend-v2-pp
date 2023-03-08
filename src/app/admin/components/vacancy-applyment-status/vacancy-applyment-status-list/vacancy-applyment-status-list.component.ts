import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IFilter, IFilterValues } from "@apptypes/entities/IFilter";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import filters from "@utils/filterOpts";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import moment = require("moment");
import { ILaboralExperience } from "@apptypes/entities/ILaboralExperience";
import { UserAccountService } from "@services/user-account.service";
import { LocalStorageService } from "@services/local-storage.service";
import { FilterType } from "@apptypes/enums/filterTypeEnum";
@Component({
  selector: "app-vacancy-applyment-status-list",
  templateUrl: "./vacancy-applyment-status-list.component.html",
  styleUrls: ["./vacancy-applyment-status-list.component.scss"]
})
export class VacancyApplymentStatusListComponent implements OnInit {
  filterType = FilterType.vacancyApplymentFilters;
  utils = Utilities;
  tableHeaders = ["", "Nombre", "Vacante"];
  loadingPage: boolean;
  _pagination: IPagination;
  itemsPerPage: number = 10;
  public filterParams: IFilterValues = {};
  private filtersBehaviour$ = new BehaviorSubject<{
    vacancyApplymentStatusId: number;
    page: number;
    filters: Object;
  }>({ filters: {}, page: 1, vacancyApplymentStatusId: null });
  public vasData$: Observable<IVacancyApplyment[]>;
  public extras$: Observable<any>;
  constructor(
    private _api: Api,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    public localStorage: LocalStorageService,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    const params$ = this._activatedRoute.params.pipe(
      tap(params =>
        this.filtersBehaviour$.next({
          vacancyApplymentStatusId: params.status,
          filters: this.localStorage.getFilterItem(this.filterType),
          page: 1
        })
      )
    );

    this.extras$ = params$;

    this.vasData$ = this.filtersBehaviour$.pipe(
      tap(opts => this.localStorage.setFilterItem(this.filterType,opts.filters)),
      switchMap(filters => this.fetchData(filters))
    );
  }

  private fetchData(filterPaginationOpts: any) {
    const { page, filters, vacancyApplymentStatusId } = filterPaginationOpts;
    return this._api
      .get(this.getUserUrl(), null, page, this.itemsPerPage, {
        vacancyApplymentStatusId,
        ...filters
      })
      .pipe(
        tap(res => (res.response["currentPage"] = page)),
        tap(response => (this.pagination = response.response)),
        map(response => {
          const data = response.response.data;
          return !filters.yearsExperience
            ? data || []
            : this.filterByYearsOfExperience(data, filters.yearsExperience);
        }),
        finalize(() => (this.loadingPage = false)),
        catchError(() => of([]))
      );
  }
  filterByYearsOfExperience(data: IVacancyApplyment[], years?: number): any[] {
    return data.filter(vap => {
      const totalYears = this.getYearsOfExperience(vap.user.laboralExperiences);
      if (totalYears >= Number(years)) {
        return vap;
      }
    });
  }

  private getYearsOfExperience(laboralExperiences: ILaboralExperience[]) {
    const totalYears = laboralExperiences.reduce((reducer, current) => {
      return (
        reducer +
        moment(current.finishDate ? current.finishDate : new Date()).diff(
          current.startDate,
          "years"
        )
      );
    }, 0);
    return totalYears;
  }
  set pagination(pagination) {
    this._pagination = {
      pages: Utilities.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    };
  }
  get pagination() {
    return this._pagination;
  }

  private getUserUrl() {
    const user = this.userAccount.getUser();
    return user.isBusinessProfile
      ? Entities.companyVacancyApplyments
      : Entities.vacancyApplyments;
  }

  applyFilter(filters: IFilter) {
    const prevFilters = this.filtersBehaviour$.getValue();
    this.filtersBehaviour$.next({
      ...prevFilters,
      filters: filters.map,
      page: 1
    });
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    const prevFilters = this.filtersBehaviour$.getValue();
    this.filtersBehaviour$.next({
      ...prevFilters,
      page: event.pageNumber
    });
  }

  public gotoUserView(applyment: any) {
    this.router.navigate([`../../../candidates/user/${applyment.id}`], {
      relativeTo: this._activatedRoute
    });
  }

  /* ................................................................................................. */
  /* FILTER SHOW OPTS */
  /* ................................................................................................. */
  get filterOpts() {
    return filters.userFilters;
  }
}
