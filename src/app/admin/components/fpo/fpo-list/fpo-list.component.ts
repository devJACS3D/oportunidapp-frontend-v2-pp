import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFacet, IFactor } from '@apptypes/entities/factor';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-fpo-list',
  templateUrl: './fpo-list.component.html',
  styleUrls: ['./fpo-list.component.scss']
})
export class FPOListComponent implements OnInit {

  public tableHeaders = ['Factores FPO', 'Faceta', 'Acciones'];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<number>();
  private itemsPerPage: number = 10;
  factors$: Observable<IFactor[]>
  constructor(
    private api: Api,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService
  ) { }

  ngOnInit() {
    this.factors$ = this.paginationOpts$.pipe(
      startWith(1),
      tap(() => this.loadingPage = true),
      switchMap((page) => this.fetchData(page))
    )
  }

  public fetchData(page: number) {
    return this.api.get(Entities.factors, null, page, this.itemsPerPage)
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

  facetsToStr(facet: IFacet[]) {
    let str = '';

    facet.forEach((f, index) => {
      str += `${f.name} ${index + 1 == facet.length ? '' : '/ '}`
    })
    return str;
  }


  editFactor(id: number) {
    this.router.navigate(['../edit', id], { relativeTo: this.activatedRoute });
  }
  createFPO() {
    this.router.navigate(['../create'], { relativeTo: this.activatedRoute });
  }

  removeFactor(id: number) {
    const ref = this;
    const modal = this.alert.customAlert({
      title: '¿Deseas eliminar el registro seleccionado?',
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      buttons: [
        {
          name: 'Eliminar',
          onClick: function () {
            ref.alert.loadingAlert(this, true);
            ref.delete(id, this)
          }
        }
      ]
    })
  }

  private delete(FPOId: number, refModal) {
     this.api.delete(Entities.factors, FPOId)
     .pipe(
       finalize(()=> this.alert.loadingAlert(refModal, false))
     )
     .subscribe(res => {
       this.alert.closeAlert();
       this.successAlert(res.message);
       this.paginationOpts$.next(1);
     }, (error) => this.errorAlert(error));
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
