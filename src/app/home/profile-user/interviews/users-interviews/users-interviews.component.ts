import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { STATUS } from 'src/app/constants/constants';
@Component({
  selector: 'app-users-interviews',
  templateUrl: './users-interviews.component.html',
  styleUrls: ['./users-interviews.component.scss']
})
export class UsersInterviewsComponent implements OnInit {

  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<{page:number}>();
  private itemsPerPage: number = 10;
  interviews$: Observable<any[]>;
  public colorStatus: Object = {
    [STATUS.UNREALIZED]: '#d6d6d6',
    [STATUS.DONE]: '#7ecc89',
  }
  constructor(private api: Api) { }

  ngOnInit() {
    this.interviews$ = this.paginationOpts$.pipe(
      startWith({page:1}),
      tap((res) => this.loadingPage = true),
      switchMap((opts) => this.fetchData(opts))
    )

  }

  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    }
  }
  get pagination() {
    return this._pagination
  }

  /* ................................................................................................. */
  /* FETCHS */
  /* ................................................................................................. */
  public fetchData(pageOpts: { page: number }) {

    const { page } = pageOpts;

    return this.api.get('user/interviews', null, page, this.itemsPerPage)
      .pipe(
        tap((response) => this.pagination = response.response),
        tap((response) => console.log(response)),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
      )
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;

    this.paginationOpts$.next({
      page: event.pageNumber
    });
  }

  public onDone(data: any, isTitle: boolean) {
    const statusId = data.done ? STATUS.DONE : STATUS.UNREALIZED;
    return this.colorStatus[statusId];
  }

  public getMinutes(hour: any){
    return `${hour.hour}:${hour.minutes? hour.minutes: "00"}`;
  }

}
