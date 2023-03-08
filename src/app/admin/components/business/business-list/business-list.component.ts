import { Component, ElementRef, OnInit } from '@angular/core';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { COLORS } from 'src/app/constants/constants';
import { BusinessProfileModalComponent } from '../business-profile-modal/business-profile-modal.component';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent implements OnInit {

  public statusFilters = [{ name: 'Publicado', value: 1 }, { name: 'Por publicar', value: 0 }]
  public tableHeaders = ['Nombre', 'Email', 'Estado', 'Publicar'];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject({ page: 1, filters: {} });
  private itemsPerPage: number = 10;
  businesses$: Observable<IBusiness[]>;
  constructor(
    private api: Api,
    private modalService: ModalService,
    private alert: DialogService,
  ) { }

  ngOnInit() {
    this.businesses$ = this.paginationOpts$.pipe(
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
  public fetchData(pageOpts: { page: number, filters: Object }) {

    const { page, filters } = pageOpts;

    return this.api.get(Entities.companies, null, page, this.itemsPerPage, filters)
      .pipe(
        tap((response) => this.pagination = response.response),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
      )
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;

    const prevValues = this.paginationOpts$.getValue();
    this.paginationOpts$.next({
      ...prevValues,
      page: event.pageNumber
    });
  }

  editBusiness(business: IBusiness) {
    this.api.get(Entities.companies, business.id).subscribe(res => this.editBusinessModal(res.response));
  }

  editBusinessModal(business: IBusiness) {
    const modal = this.modalService.create(BusinessProfileModalComponent, {
      data: business
    });
    modal.afterDestroy$.subscribe(() => {
      this.paginationOpts$.next(this.paginationOpts$.getValue());
    });
  }

  searchFilter(filterOpts: { company: string, companyActive?: number }) {
    this.paginationOpts$.next({
      page: 1,
      filters: {
        ...filterOpts
      }
    })
  }

  setActive(event: { target: HTMLInputElement; }, business: IBusiness) {

    const toggleStatus = event.target.checked;

    this.alert.customAlert({
      icon: COLORS.WARNING,
      message: `¿Estas seguro que deseas ${business.active ? 'despublicar' : 'publicar'} esta empresa?`,
      bgColor: COLORS.WARNING,
      bgTop: true,
      buttons: [
        {
          name: 'Cancelar',
          class: 'primary-border',
          onClick: (() => {
            event.target.checked = !toggleStatus;
            this.alert.closeAlert();
          })
        },
        {
          name: `Continuar`,
          class: 'primary-default',
          onClick: (() => {
            this.activeBusiness(toggleStatus, business, event);
            this.alert.closeAlert()
          })
        }
      ]
    })
  }

  private activeBusiness(active: boolean, business: IBusiness, event?: { target: HTMLInputElement }) {
    this.api.put(Entities.companies, { active, nit: business.nit }, business.id)
      .subscribe(res => {
        business.active = active;
        this.successAlert(res.message);
      }, (error) => {
        business.active = !active
        this.errorAlert(error);
      });
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
