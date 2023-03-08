import { Component, OnInit } from "@angular/core";
import { ApiResponseRecords, ApiResponse } from "@apptypes/api-response";
import { IPagination } from "@apptypes/pagination";
import { Api } from "@utils/api";
import { Router, ActivatedRoute } from "@angular/router";
import { AppSettings } from "@services/settings";
import { Entities } from "@services/entities";
import { LocalStorageService } from "@services/local-storage.service";
import { Utilities } from "@utils/utilities";
import { ISuccessCase } from "@apptypes/entities/ISuccessCase";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import {
  catchError,
  finalize,
  map,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { IPageOption } from "@apptypes/entities/IPageOption";

@Component({
  selector: "app-success-stories-page",
  templateUrl: "./success-stories-page.component.html",
  styleUrls: ["./success-stories-page.component.scss"]
})
export class SuccessStoriesPageComponent implements OnInit {
  arrayOne(n: number): any[] {
    return Array(n);
  }

  public _pagination: IPagination;
  _loadingPage: boolean;

  utils = Utilities;
  filters$ = new BehaviorSubject<IPageOption>({
    page: 1,
    filters: { forCase: 2 } //2 means filter by "trabajadores"
  });
  public successCases$: Observable<ISuccessCase[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api
  ) {}

  async ngOnInit() {
    this.successCases$ = this.filters$.pipe(
      tap(_ => (this._loadingPage = true)),
      switchMap(opts => this.fetchSuccessCases(opts))
    );
  }

  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: 10,
      currentPage: pagination.currentPage
    };
  }
  get pagination() {
    return this._pagination;
  }

  /* ................................................................................................. */
  /* FETCHS */
  /* ................................................................................................. */
  public fetchSuccessCases(pagination: IPageOption) {
    return this.api
      .get(`${Entities.v2SuccessCases}/list`, null, pagination.page, 10, {
        ...pagination.filters
      })
      .pipe(
        tap(response => (response.response["currentPage"] = pagination.page)),
        tap(response => (this.pagination = response.response)),
        map(response => response.response.data || []),
        finalize(() => (this._loadingPage = false)),
        catchError(() => of([]))
      );
  }
  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    const prevFilters = this.filters$.getValue();
    this.filters$.next({
      ...prevFilters,
      page: event.pageNumber
    });
  }

  public changeFilter(rol: number) {
    this.filters$.next({
      page: 1,
      filters: {
        forCase: rol
      }
    });
  }

  goToDetail(id: number) {
    this.router.navigate(["/home/success-cases/succeed/" + id]);
  }
}
