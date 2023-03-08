import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPageOption } from '@apptypes/entities/IPageOption';
import { IPost } from '@apptypes/entities/post';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, Subject, of } from 'rxjs';
import { startWith, switchMap, tap, finalize, catchError,map } from 'rxjs/operators';

@Component({
  selector: 'app-post-card-list',
  templateUrl: './post-card-list.component.html',
  styleUrls: ['./post-card-list.component.scss']
})
export class PostCardListComponent implements OnInit {

  @Input() showPagination: boolean = true;
  @Input() itemsPerPage = 10;
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  posts$:Observable<IPost[]>;
  pagination$ = new Subject<IPageOption>();
  constructor(
    private api: Api,
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {

    this.posts$ = this.pagination$.pipe(
      startWith({page:1}),
      switchMap((options) => this.fetchPosts(options))
    )
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
  public fetchPosts(pagination: IPageOption) {
    return this.api
      .get(
        `${Entities.v2Blog}/list`,
        null,
        pagination.page,
        this.itemsPerPage,
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

    this.pagination$.next({
      page: event.pageNumber,
    });
  }

  goToPostDetail(post:IPost){
    this.router.navigate(['home/blogs/posts/detail',post.id]);
  }
}
