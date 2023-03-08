import { Component, OnInit } from "@angular/core";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { Observable, of, Subject } from "rxjs";
import {
  catchError,
  finalize,
  map,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { COLORS } from "src/app/constants/constants";
import { SaveGroupBusinessFormComponent } from "../save-group-business-form/save-group-business-form.component";

@Component({
  selector: "app-group-business-list",
  templateUrl: "./group-business-list.component.html",
  styleUrls: ["./group-business-list.component.scss"]
})
export class GroupBusinessListComponent implements OnInit {
  public tableHeaders = ["Empresa", "Estado","Empleados"];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<number>();
  private itemsPerPage: number = 10;
  businesses$: Observable<any[]>;
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.businesses$ = this.paginationOpts$.pipe(
      startWith(1),
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

  /* ................................................................................................. */
  /* FETCHS */
  /* ................................................................................................. */
  public fetchData(page: number) {
    return this.api
      .get(`${Entities.groupBusinesses}/list`, null, page, this.itemsPerPage)
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
    this.itemsPerPage = event.itemsPerPage;

    this.paginationOpts$.next(event.pageNumber);
  }

  openFormModal(business?: any) {
    let data = { id: null, name: null, active: true };

    if (business) data = Object.assign(data, business);

    const modal = this.modalService.create(SaveGroupBusinessFormComponent, {
      data
    });
    modal.afterDestroy$.subscribe(() => this.paginationOpts$.next(1));
  }

  public confirmDelete(business) {
    this.alert.customAlert({
      title: "Eliminar",
      message: "¿Estas seguro que deseas eliminar esta empresa?",
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      icon: "delete",
      buttons: [
        {
          name: "Eliminar",
          onClick: () => {
            this.delete(business);
          },
          class: "primary-default"
        }
      ]
    });
  }

  public delete(business) {
    this.api
      .delete(`${Entities.groupBusinesses}/delete`, business.id)
      .subscribe(
        res => {
          this.paginationOpts$.next(1);
          this.alert.closeAlert();
          this.alert.successAlert(
            "Se ha eliminado el registro satisfactoriamente."
          );
        },
        error => this.alert.errorAlert(error)
      );
  }
}
