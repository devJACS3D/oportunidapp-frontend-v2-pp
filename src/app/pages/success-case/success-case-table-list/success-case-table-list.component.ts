import { Component, OnInit } from '@angular/core';
import { SuccessCaseDto } from '@apptypes/dto/successCase';
import { IPageOption } from '@apptypes/entities/IPageOption';
import { ISuccessCase } from '@apptypes/entities/ISuccessCase';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap, switchMap, finalize, catchError,map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { SaveSuccessCaseComponent } from '../save-success-case/save-success-case.component';

@Component({
  selector: 'app-success-case-table-list',
  templateUrl: './success-case-table-list.component.html',
  styleUrls: ['./success-case-table-list.component.scss']
})
export class SuccessCaseTableListComponent implements OnInit {

  public tableHeaders = [
    "Fotografía",
    "Nombre de usuario",
    "Comentario"
  ];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject<IPageOption>({
    page: 1,
    filters: {}
  });
  private itemsPerPage: number = 10;
  successCases$: Observable<ISuccessCase[]>;
  deletingAt$ = new Subject<number>();
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.successCases$ = this.paginationOpts$.pipe(
      tap(() => (this.loadingPage = true)),
      switchMap(pageOpts => this.fetchSuccessCases(pageOpts))
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
  public fetchSuccessCases(pagination: IPageOption) {
    return this.api
      .get(
        `${Entities.v2SuccessCases}/list`,
        null,
        pagination.page,
        this.itemsPerPage,
        { ...pagination.filters }
      )
      .pipe(
        tap(response => (response.response["currentPage"] = pagination.page)),
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

    const preValue = this.paginationOpts$.getValue();
    this.paginationOpts$.next({
      page: event.pageNumber,
      filters: preValue.filters
    });
  }

  openFormModal(succesCase?: ISuccessCase) {
    const successCaseDto = new SuccessCaseDto(succesCase);

    const modal = this.modalService.create(SaveSuccessCaseComponent, {
      data: successCaseDto
    });

    modal.afterDestroy$.subscribe(_ => {
      this.paginationOpts$.next({ page: 1, filters: {} });
    });
  }

  public async confirmDelete(successCase: ISuccessCase) {
    const confirm = await this.alert.confirmAlert({
      bgBottom:false,
      bgTop:true,
      message:"¿Deseas eliminar el registro seleccionado?"
    });

    if(!confirm) return;
    this.delete(successCase);
  }

  public delete(succesCase: ISuccessCase) {
    this.deletingAt$.next(succesCase.id);
    this.api
      .delete(`${Entities.v2SuccessCases}/delete`, succesCase.id)
      .pipe(
        finalize(()=> this.deletingAt$.next())
      )
      .subscribe(
        res => {
          this.paginationOpts$.next({ page: 1, filters: {} });
          this.alert.successAlert(
            "Se ha eliminado el registro satisfactoriamente."
          );
        },
        error => this.alert.errorAlert(error)
      );
  }

  searchFilter(filter: object) {
    this.paginationOpts$.next({ page: 1, filters: filter });
  }
}
