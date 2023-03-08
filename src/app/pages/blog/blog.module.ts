import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlogComponent } from "./blog/blog.component";
import { BlogRoutingModule } from "./blog-routing.module";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { FiltersModule } from "src/app/components/filters/filters.module";
import { PostListTableComponent } from "./post-list-table/post-list-table.component";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { SavePostComponent } from "./save-post/save-post.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";
import { PostListComponent } from "./post-list/post-list.component";
import { CardBlogComponent } from "./card-blog/card-blog.component";
import { PipesModule } from "src/app/pipes/pipes.module";
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostCardListComponent } from './post-card-list/post-card-list.component';
import { SaveCommentComponent } from './comments/save-comment/save-comment.component';
import { CommentCardComponent } from './comments/comment-card/comment-card.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    PaginationModule,
    PageHeaderModule,
    FiltersModule,
    FloatingButtonsModule,
    ReactiveFormsModule,
    FieldErrorModule,
    PipesModule
  ],
  declarations: [
    PostListTableComponent,
    BlogComponent,
    SavePostComponent,
    PostListComponent,
    CardBlogComponent,
    PostDetailComponent,
    PostCardListComponent,
    SaveCommentComponent,
    CommentCardComponent,
    CommentListComponent,
  ],
  providers: [ModalService],
  entryComponents: [SavePostComponent],
  exports:[
    PostCardListComponent
  ]
})
export class BlogModule {}
