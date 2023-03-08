import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import {
  catchError,
  finalize,
  map,
  skip,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { COLORS } from "src/app/constants/constants";
import { GroupBusinessWorkerFormComponent } from "../group-business-worker-form/group-business-worker-form.component";

@Component({
  selector: "app-group-business-worker-list",
  templateUrl: "./group-business-worker-list.component.html",
  styleUrls: ["./group-business-worker-list.component.scss"]
})
export class GroupBusinessWorkerListComponent implements OnInit {
  public tableHeaders = ["Nombre", "Correo electrónico", "Ciudad"];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$:BehaviorSubject<{ page: number; gbId: number }>;
  private itemsPerPage: number = 10;
  workers$: Observable<any[]>;
  constructor(
    private api: Api,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    const params$ = this.activatedRoute.params.pipe(
      map(params => ({ page: 1, gbId: params.id }))
    ).subscribe(res=> {
      
      this.paginationOpts$ = new BehaviorSubject(res);

      this.workers$ = this.paginationOpts$.pipe(
        tap(() => (this.loadingPage = true)),
        switchMap(opts => this.fetchData(opts))
      );

    })

    
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
  public fetchData(options: { page: number; gbId: number }) {
    return this.api
      .get(
        `${Entities.groupBusinessesWorkers}/list`,
        null,
        options.page,
        this.itemsPerPage,
        {
          gbId: options.gbId
        }
      )
      .pipe(
        tap(response => (response.response["currentPage"] = options.page)),
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

    this.paginationOpts$.next({
      page: event.pageNumber,
      gbId: this.paginationOpts$.value.gbId
    });
  }

  openFormModal(worker?: any) {
    let data = {
      id: null,
      fullName: null,
      email: null,
      cityId: null,
      groupBusinessId: this.paginationOpts$.value.gbId
    };
    if (worker) data = Object.assign(data, worker);
    const modal = this.modalService.create(GroupBusinessWorkerFormComponent, {
      data
    });
    modal.afterDestroy$.subscribe(() =>
      this.paginationOpts$.next({
        page: 1,
        gbId: this.paginationOpts$.value.gbId
      })
    );
  }

  public confirmDelete(worker) {
    this.alert.customAlert({
      title: "Eliminar",
      message: "¿Estas seguro que deseas eliminar al empleado?",
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      icon: "delete",
      buttons: [
        {
          name: "Eliminar",
          onClick: () => {
            this.delete(worker);
          },
          class: "primary-default"
        }
      ]
    });
  }

  public delete(worker) {
    this.api
      .delete(`${Entities.groupBusinessesWorkers}/delete`, worker.id)
      .subscribe(
        res => {
          this.paginationOpts$.next({
            page: 1,
            gbId: this.paginationOpts$.value.gbId
          });
          this.alert.closeAlert();
          this.alert.successAlert(
            "Se ha eliminado el empleado satisfactoriamente."
          );
        },
        error => this.alert.errorAlert(error)
      );
  }
}
