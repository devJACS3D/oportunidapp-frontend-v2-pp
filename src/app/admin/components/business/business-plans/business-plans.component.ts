import { Component, OnInit } from '@angular/core';
import { IPackage } from '@apptypes/entities/IPackage';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, Subject, of } from 'rxjs';
import { startWith, tap, switchMap, finalize, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-business-plans',
  templateUrl: './business-plans.component.html',
  styleUrls: ['./business-plans.component.scss']
})
export class BusinessPlansComponent implements OnInit {


  tableHeaders = ['Paquete', 'Publicaciones disponibles', 'Precio', 'Fecha de vencimiento', 'Fecha de creación']
  packages$: Observable<IPackage[]>;
  private currentPage$ = new Subject<number>();
  private itemsPerPage: number = 10;
  private _pagination: IPagination;
  public loadingPage: boolean;
  constructor(
    private api: Api
  ) { }

  ngOnInit() {
    this.packages$ = this.currentPage$.pipe(
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
      currentPage: pagination.currentPage
    }
  }
  get pagination() {
    return this._pagination
  }

  public fetchData(page: number) {
    return this.api.get(`${Entities.companies_pack}/me`, null, page, this.itemsPerPage)
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

}
