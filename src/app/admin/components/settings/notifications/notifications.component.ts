import { Component, OnInit } from "@angular/core";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { UpdateNotificationModalComponent } from "./update-notification-modal/update-notification-modal.component";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  public tableHeaders = ["Nombre de la notificación", "Ultima edición"];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject({ page: 1, filters: {} });
  private itemsPerPage: number = 10;
  notifications$: Observable<any[]>;
  constructor(private api: Api, private modalService: ModalService) {}

  ngOnInit() {
    this.notifications$ = this.paginationOpts$.pipe(
      tap(() => (this.loadingPage = true)),
      switchMap(pageOpts => this.fetchData(pageOpts))
    );
  }

  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    };
  }
  get pagination() {
    return this._pagination;
  }

  public fetchData(pageOpts: { page: number; filters: Object }) {
    const { page, filters } = pageOpts;

    return this.api
      .get(Entities.notifications, null, page, this.itemsPerPage, filters)
      .pipe(
        tap(response => (response.response["currentPage"] = page)),
        tap(response => (this.pagination = response.response)),
        map(response => response.response.data || []),
        finalize(() => (this.loadingPage = false)),
        catchError(() => of([]))
      );
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    const prevValues = this.paginationOpts$.getValue();
    this.paginationOpts$.next({
      ...prevValues,
      page: event.pageNumber
    });
  }

  searchFilter(filters) {
    const queries = Object.keys(filters).length > 0 ? filters : {};

    this.paginationOpts$.next({
      page: 1,
      filters: queries
    });
  }

  edit(notification) {
    const modal = this.modalService.create(UpdateNotificationModalComponent, {
      data: notification
    });

    modal.afterDestroy$.subscribe(() => {
      this.paginationOpts$.next({ page: 1, filters: {} });
    });
  }
}
