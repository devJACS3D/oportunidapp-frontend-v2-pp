import { Component, OnInit } from '@angular/core';
import { IPartner } from '@apptypes/entities/IPartner';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { COLORS } from 'src/app/constants/constants';
import { SavePartnerComponent } from '../save-partner/save-partner.component';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {

  public tableHeaders = ['Nombre de empresa', 'Ultima edición'];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject({ page: 1, partnerQ: {} });
  private itemsPerPage: number = 10;
  partners$: Observable<IPartner[]>;
  constructor(
    private api: Api,
    private modalService: ModalService,
    private alert:DialogService,
  ) { }

  ngOnInit() {
    this.partners$ = this.paginationOpts$.pipe(
      tap(() => this.loadingPage = true),
      switchMap((pageOpts) => this.fetchData(pageOpts))
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
  public fetchData(pageOpts: { page: number, partnerQ: Object }) {

    const { page, partnerQ } = pageOpts;

    return this.api.get(Entities.alliances, null, page, this.itemsPerPage, partnerQ)
      .pipe(
        tap((response) => response.response['currentPage'] = page),
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

  searchFilter(filters) {

    const partnerQ = Object.keys(filters).length > 0 ? filters : {}

    this.paginationOpts$.next({
      page: 1,
      partnerQ
    });
  }

  /* ................................................................................................. */
  /* MODALS */
  /* ................................................................................................. */
  savePartner(partner?: IPartner) {
    let payload = {
      id: null,
      name: null,
      url: null,
      description: null,
      images: null
    };

    if (partner)
      payload = Object.assign(payload, partner);

    const modal = this.modalService.create(SavePartnerComponent, {
      data: payload
    });
    modal.afterDestroy$.subscribe(res => {
      this.paginationOpts$.next({ page: 1, partnerQ: {} });
    });
  }

  editPartner(partnerId: number) {
    this.api.get(Entities.alliances, partnerId)
      .pipe(
        map((response) => response.response.registerDetails),
      ).subscribe(res => this.savePartner(res));
  }

  async deleteModal(partnerId: number) {
    const ref = this;
    const modal = this.alert.customAlert({
      title: '¿Deseas eliminar la empresa aliada seleccionada?',
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      buttons: [
        {
          name: 'Eliminar',
          onClick: function () {
            ref.alert.loadingAlert(this, true);
            ref.delete(partnerId, this)
          }
        }
      ]
    })
  }
  private delete(partnerId: number, refModal) {
    this.api.delete(Entities.alliances, partnerId).subscribe(res => {
      this.alert.closeAlert();
      this.successAlert(res.message);
      this.paginationOpts$.next({ page: 1, partnerQ: {} });
    }, (error) => this.errorAlert(error), () => {
      this.alert.loadingAlert(refModal, false);
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
