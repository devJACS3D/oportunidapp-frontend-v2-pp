import { Component, OnInit } from "@angular/core";
import { ApiResponse } from "@apptypes/api-response";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { STATUS } from "src/app/constants/constants";
import { ModalService } from 'src/app/components/modal/modal.service';
import { ModalQualifyComponent } from 'src/app/components/modals/modal-qualify/modal-qualify.component';
import { Router, ActivatedRoute } from '@angular/router';
import { QUALIFY } from '@apptypes/enums/qualify';
import { LoggedUser } from "@apptypes/types";

@Component({
  selector: "app-entry-orders-list",
  templateUrl: "./entry-orders-list.component.html",
  styleUrls: ["./entry-orders-list.component.scss"]
})
export class EntryOrdersListComponent implements OnInit {
  public tableHeaders = ["Código", "Fecha", "Vacantes", "Estado", "Archivo"];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject({ page: 1, code: {} });
  private itemsPerPage: number = 10;
  public currentUser: LoggedUser;
  entryOrders$: Observable<any[]>;
  entryOrderStatusAtLoading$ = new Subject<number>();
  downloadingAt$ = new Subject<number>();
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.currentUser = this.api.getCurrentUser();
    this.entryOrders$ = this.paginationOpts$.pipe(
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
  public fetchData(pageOpts: { page: number; code: Object }) {
    const { page, code } = pageOpts;

    return this.api
      .get(`${Entities.entryOrders}/list`, null, page, this.itemsPerPage, code)
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

    const prevValues = this.paginationOpts$.getValue();
    this.paginationOpts$.next({
      ...prevValues,
      page: event.pageNumber
    });
  }

  searchFilter(filters) {
    const code = Object.keys(filters).length > 0 ? filters : {};
    this.paginationOpts$.next({
      page: 1,
      code
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Check if it is a company and then compare if the candidate has completed the working month
  --------------------------------------------------------------------------------------------------------------------------*/
  qualifyCandidates(entryOrder: any) {
    const modal = this.modalService.create(ModalQualifyComponent, {
      data: {
        title: 'Calificar candidato',
        subtitle: '¿Cómo calificas el rendimiento de',
        fullName: entryOrder.vacancyApplyment.user.fullName,
        typeQualify: QUALIFY.CANDIDATES,
        entryOrderId: entryOrder.id,
        vacancyApplymentId: entryOrder.vacancyApplymentId
      }
    });
    modal.afterDestroy$.subscribe(res => {
      if (res.redirectToAptos)
        this.goToCompetendsOrStands(8, entryOrder.vacancyApplyment.vacancyId, 'competents')
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Reditect pages
  --------------------------------------------------------------------------------------------------------------------------*/
  public goToCompetendsOrStands(status: number, vaid: number, to: 'competents' | 'stands') {
    this.router.navigate([`../../candidates/va/${status}/${vaid}`], {
      relativeTo: this.activatedRoute,
      queryParams: {
        s: to == 'competents' ? 'Aptos' : 'Postulados'
      }
    })
  }

  async confirmStatusAlert(entryOrder: any) {
    let opts = { bgTop: true, bgBottom: false };
    let keyWord = "";
    let status = null;
    if (entryOrder.statusId == STATUS.DONE) {
      keyWord = "cancelar";
      status = STATUS.REJECTED;
    } else {
      keyWord = "restablecer";
      status = STATUS.DONE;
    }

    opts[
      "message"
    ] = `¿Estas seguro que deseas ${keyWord} esta orden de ingreso?`;

    const alertResponse = await this.alert.confirmAlert(opts);

    if (!alertResponse) return;

    this.setStatus(entryOrder.id, status);
  }

  setStatus(id: number, status: number) {
    this.entryOrderStatusAtLoading$.next(id);
    this.api
      .put(`${Entities.entryOrders}/status`, { status }, id)
      .pipe(finalize(() => this.entryOrderStatusAtLoading$.next()))
      .subscribe(res => {
        this.paginationOpts$.next({
          page: 1,
          code: {}
        });
      });
  }

  downloadFile(entryOrder: any) {
    this.downloadingAt$.next(entryOrder.id);
    this.api
      .postData(Entities.downloadFile, {
        file: entryOrder.file
      })
      .pipe(finalize(() => this.downloadingAt$.next()))
      .subscribe((s3File: any) => {
        Utilities.downloadFromBase64(s3File.path, s3File.name);
      });
  }
}
