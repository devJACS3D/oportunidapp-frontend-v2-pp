import { Component, Input, OnInit } from "@angular/core";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { merge, Observable, Subject } from "rxjs";
import { finalize, map, startWith, switchMap, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Component({
  selector: "app-comment-list",
  templateUrl: "./comment-list.component.html",
  styleUrls: ["./comment-list.component.scss"]
})
export class CommentListComponent implements OnInit {
  @Input() postId: number;
  @Input("refresh") refresh$: Subject<any>;
  deletingComment$ = new Subject<boolean>();
  pageOpts$ = new Subject();
  postComments$: Observable<any[]>;
  limit = 5;
  totalElements = null;
  constructor(
    private api: Api,
    private alert:DialogService,
    ) {}

  ngOnInit() {
    const pageOpts$ = this.pageOpts$.pipe(
      startWith({ postId: this.postId, page: 1, limit: this.limit })
    );

    const refresh$ = this.refresh$.pipe(
      map(() => ({ postId: this.postId, page: 1, limit: this.limit }))
    );

    this.postComments$ = merge(refresh$, pageOpts$).pipe(
      switchMap(pageOpts => this.fetchPostComments(pageOpts))
    );
  }

  private fetchPostComments(pageOpts: any) {
    const { postId, page, limit } = pageOpts;
    const extraUrl = `${postId}?pageNumber=${page}&elementsNumber=${limit}`;

    return this.api.get(`${Entities.v2PostComment}`, extraUrl).pipe(
      tap(res => {
        this.totalElements = Number(res.response.elementsNumber);
      }),
      map(res => res.response.data || [])
    );
  }

  public loadMore() {
    const limit = this.limit + 5 <= this.totalElements? (this.limit +5): this.totalElements
    return this.paginate(limit);
  }

  private paginate(limit: number){
    this.limit = limit;
    this.pageOpts$.next({
      page: 1,
      postId: this.postId,
      limit: this.limit
    });
  }

  async confirmDelete(id:number){

    const confirm = await this.alert.confirmAlert({
      bgColor:"danger",
      icon: "warning",
      message:"¿Estas seguro que deseas eliminar el comentario?"
    })

    if(!confirm) return;

    return this.delete(id);
  }

  private delete(id:number){
    this.deletingComment$.next(true);
    this.api.delete(`${Entities.v2PostComment}/delete`,id)
    .pipe(
      finalize(()=> this.deletingComment$.next(false))
    )
    .subscribe(_ => {
      this.alert.successAlert("Comentario eliminado satisfactoriamente")
      this.paginate(5);
    },(errorMsg)=> this.alert.errorAlert(errorMsg))
  }
}
