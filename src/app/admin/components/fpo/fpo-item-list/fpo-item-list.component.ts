import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFpoItem } from '@apptypes/entities/factor';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, of, Subject } from 'rxjs';
import { startWith, tap, switchMap, finalize, catchError, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { COLORS } from 'src/app/constants/constants';
import { EditFpoItemComponent } from '../save-fpo-item/forms/edit-fpo-item/edit-fpo-item.component';

@Component({
  selector: 'app-fpo-item-list',
  templateUrl: './fpo-item-list.component.html',
  styleUrls: ['./fpo-item-list.component.scss']
})
export class FPOItemListComponent implements OnInit {

  public tableHeaders = ['Item', 'Factor', 'Facetas', 'Acciones'];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<number>();
  private itemsPerPage: number = 10;
  fpoItems$: Observable<IFpoItem[]>
  constructor(
    private api: Api,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private modal: ModalService

  ) { }

  ngOnInit() {
    this.fpoItems$ = this.paginationOpts$.pipe(
      startWith(1),
      tap(() => this.loadingPage = true),
      switchMap((page) => this.fetchData(page))
    )
  }

  public fetchData(page: number) {
    return this.api.get(Entities.fpoItems, null, page, this.itemsPerPage)
      .pipe(
        tap((response) => response.response.currentPage = page),
        tap((response) => this.pagination = response.response),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
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

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.paginationOpts$.next(event.pageNumber);
  }


  editFpoItem(item: IFpoItem) {
    const modal = this.modal.create(EditFpoItemComponent, {
      data: item
    })

    modal.afterDestroy$.subscribe(() => {
      this.paginationOpts$.next(this.pagination.currentPage);
    });
  }
  createFPO() {
    this.router.navigate(['../create'], { relativeTo: this.activatedRoute });
  }
  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    })
  }

}
