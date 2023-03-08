import { Component, OnInit } from '@angular/core';
import { IMembership } from '@apptypes/entities/membership';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { COLORS } from 'src/app/constants/constants';
import { SaveMembershipComponent } from '../save-membership/save-membership.component';

@Component({
  selector: 'app-membership-list',
  templateUrl: './membership-list.component.html',
  styleUrls: ['./membership-list.component.scss']
})
export class MembershipListComponent implements OnInit {

  memberships$: Observable<IMembership[]>;
  public tableHeaders = ['Nombre', 'Número de vacantes', 'Días de vigencia', 'Precio'];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private currentPage: number = 1;
  private currentPage$ = new Subject<number>();
  private itemsPerPage: number = 10;
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.memberships$ = this.currentPage$.pipe(
      startWith(1),
      tap(() => this.loadingPage = true),
      switchMap((page) => this.fetchData(page))
    )
  }

  set pagination(pagination) {
    this._pagination = {
      pages: Utilities.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage
    }
  }
  get pagination() {
    return this._pagination
  }

  public fetchData(page: number) {
    return this.api.get(Entities.packageslist, null, page, this.itemsPerPage)
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
    this.currentPage = event.pageNumber;
    this.itemsPerPage = event.itemsPerPage;
    this.currentPage$.next(event.pageNumber);
  }

  /* ................................................................................................. */
  /* Actions */
  /* ................................................................................................. */

  async deleteModal(membership: IMembership) {
    const ref = this;
    const modal = this.alert.customAlert({
      title: '¿Deseas eliminar la membresia seleccionada?',
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      buttons: [
        {
          name: 'Eliminar',
          onClick: function () {
            ref.alert.loadingAlert(this, true);
            ref.delete(membership, this)
          }
        }
      ]
    })
  }
  private delete(membership: IMembership, refModal) {
    this.api.delete(Entities.packages, membership.id).subscribe(res => {
      membership['hidden'] = true;
      this.pagination.elementsNumber--;
      this.alert.closeAlert();
      this.successAlert(res.message);
    }, (error) => this.errorAlert(error), () => {
      this.alert.loadingAlert(refModal, false);
    });
  }

  edit(membership: IMembership) {
    this.api.get(Entities.packages, membership.id)
      .pipe(
        map(res => res.response)
      )
      .subscribe((res) => this.saveMembership(res), (error) => this.errorAlert(error));
  }

  saveMembership(data?: any) {

    let payload = { id: null, label: null, price: null, subtitulo: null, range: null, vacancies: null, description: null };
    if (data)
      payload = Object.assign(payload, data);

    const ref = this.modalService.create(SaveMembershipComponent, {
      data: payload
    });

    ref.afterDestroy$.subscribe(() => {
      this.currentPage$.next(this.currentPage)
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
