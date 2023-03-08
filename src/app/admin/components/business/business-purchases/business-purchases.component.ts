import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPayU } from '@apptypes/entities/IPayU';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-business-purchases',
  templateUrl: './business-purchases.component.html',
  styleUrls: ['./business-purchases.component.scss']
})
export class BusinessPurchasesComponent implements OnInit {

  tableHeaders = ['Order ID', 'Estado', 'Fecha', 'Detalle', 'Valor $', 'Cargar factura']
  purchases$: Observable<IPayU[]>;
  private currentPage$ = new Subject<number>();
  private itemsPerPage: number = 10;
  private _pagination: IPagination;
  public loadingPage: boolean;
  private _uploadingFileAt$ = new Subject<number | null>();
  uploadingFileAt$: Observable<number | null>
  utils = Utilities;
  constructor(
    private api: Api,
    private alert: DialogService
  ) { }

  ngOnInit() {
    this.purchases$ = this.currentPage$.pipe(
      startWith(1),
      tap(() => this.loadingPage = true),
      switchMap((page) => this.fetchData(page))
    )

    this.uploadingFileAt$ = this._uploadingFileAt$.pipe(
      shareReplay(1)
    )
  }

  set pagination(pagination) {
    this._pagination = {
      pages: Utilities.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    }
  }
  get pagination() {
    return this._pagination
  }

  public fetchData(page) {
    return this.api.get(Entities.paymentsList, null, page, this.itemsPerPage)
      .pipe(
        tap((res) => res.response['currentPage'] = page),
        tap((response) => this.pagination = response.response),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
      )
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this.currentPage$.next(event.pageNumber)
  }

  setFile(event, purchase: IPayU) {
    const file: File = event.target.files[0];
    const fileType = file.type;

    if (fileType !== 'application/pdf')
      return;

    //dynamic property
    purchase['attachedFile'] = file;

    event.target.value = null;

  }

  uploadFile(purchase: IPayU, index: number) {
    this._uploadingFileAt$.next(index);
    const formData = new FormData();
    formData.append('invoice', purchase.attachedFile);

    let uploadPath = Entities.companyPayUVacancyInvoice;
    if (purchase.companyPackage)
      uploadPath = Entities.companyPayUPackageInvoice;

    this.api.putData(uploadPath, formData, purchase.id)
      .pipe(
        finalize(() => this._uploadingFileAt$.next(null))
      )
      .subscribe(res => {
        purchase.attached = res.response.attached;
        delete purchase.attachedFile;
        this.successAlert(res.message);
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
