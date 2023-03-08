import { Component, OnInit } from "@angular/core";
import { PostDto } from "@apptypes/dto/post";
import { IPageOption } from "@apptypes/entities/IPageOption";
import { IPost } from "@apptypes/entities/IPost";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import {
  catchError,
  finalize,
  map,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { SavePostComponent } from "../save-post/save-post.component";

@Component({
  selector: "app-post-list-table",
  templateUrl: "./post-list-table.component.html",
  styleUrls: ["./post-list-table.component.scss"]
})
export class PostListTableComponent implements OnInit {
  public tableHeaders = [
    "Archivos multimedia",
    "Nombre del blog",
    "Autor",
    "Descripción del blog",
    "Sobre el autor"
  ];
  public utils = Utilities;
  public loadingPage: boolean;
  private _pagination: IPagination;
  private paginationOpts$ = new BehaviorSubject<IPageOption>({
    page: 1,
    filters: {}
  });
  private itemsPerPage: number = 10;
  blogs$: Observable<IPost[]>;
  constructor(
    private api: Api,
    private alert: DialogService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.blogs$ = this.paginationOpts$.pipe(
      tap(() => (this.loadingPage = true)),
      switchMap(pageOpts => this.fetchData(pageOpts))
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
  public fetchData(pagination: IPageOption) {
    return this.api
      .get(
        `${Entities.v2Blog}/list`,
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

  openFormModal(post?: IPost) {
    const postDto = new PostDto(post);

    const modal = this.modalService.create(SavePostComponent, {
      data: postDto
    });

    modal.afterDestroy$.subscribe(_ => {
      this.paginationOpts$.next({ page: 1, filters: {} });
    });
  }

  public async confirmDelete(post:IPost) {
    const confirm = await this.alert.confirmAlert({
      bgBottom:false,
      bgTop:true,
      message:"¿Deseas eliminar el registro seleccionado?"
    });

    if(!confirm) return;
    this.delete(post);
  }

  public delete(post:IPost) {
    this.api
      .delete(`${Entities.v2Blog}/delete`, post.id)
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
