import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPartner } from '@apptypes/entities/IPartner';
import { PreviewCardItem } from '@apptypes/entities/IPreviewCardItem';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-partners-page-list',
  templateUrl: './partners-page-list.component.html',
  styleUrls: ['./partners-page-list.component.scss']
})
export class PartnersPageListComponent implements OnInit {

  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new Subject<number>();
  private itemsPerPage: number = 30;
  partners$: Observable<IPartner[]>;
  utils = Utilities;
  constructor(
    private api: Api,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.partners$ = this.paginationOpts$.pipe(
      startWith(1),
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
  public fetchData(page: number) {

    return this.api.get(Entities.alliances, null, page, this.itemsPerPage)
      .pipe(
        tap((response) => this.pagination = response.response),
        tap((response) => console.log(response)),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
      )
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;
    this.paginationOpts$.next(event.pageNumber);
  }

  mapItem(partner: IPartner): PreviewCardItem {
    return {
      id: partner.id,
      title: partner.name,
      description: partner.description,
      image: this.utils.getImgSrc(partner.images[0])
    }
  }

  goToDetail(item: PreviewCardItem) {
    this.router.navigate([`../${item.id}`],{relativeTo:this.activatedRoute});
  }
}
