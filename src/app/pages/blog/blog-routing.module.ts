import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostDetailResolverService } from "@services/resolvers/postDetail.service";
import { IsAdminGuard } from "src/app/guards/is-admin.guard";
import { BlogComponent } from "./blog/blog.component";
import { PostDetailComponent } from "./post-detail/post-detail.component";
import { PostListTableComponent } from "./post-list-table/post-list-table.component";
import { PostListComponent } from "./post-list/post-list.component";

const routes: Routes = [
  {
    path: "",
    component: BlogComponent,
    children: [
        {
            path:"posts-list",
            canActivate:[IsAdminGuard],
            component: PostListTableComponent
        },
        {
            path:"posts",
            component: PostListComponent
        },
        {
            path:"posts/detail/:id",
            component: PostDetailComponent,
            resolve:{
              post: PostDetailResolverService
            }
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
