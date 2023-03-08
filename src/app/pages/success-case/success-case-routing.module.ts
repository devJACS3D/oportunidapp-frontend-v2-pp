import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SuccessCaseDetailResolverService } from "@services/resolvers/successCaseDetail.service";
import { IsAdminGuard } from "src/app/guards/is-admin.guard";
import { DetailSuccessStoryComponent } from "./detail-success-story/detail-success-story.component";
import { SuccessCaseTableListComponent } from "./success-case-table-list/success-case-table-list.component";
import { SuccessCaseComponent } from "./success-case.component";
import { SuccessStoriesPageComponent } from "./success-stories-page/success-stories-page.component";


const routes: Routes = [
  {
    path: "",
    component: SuccessCaseComponent,
    children: [
        {
            path:"cases-list",
            canActivate:[IsAdminGuard],
            component: SuccessCaseTableListComponent
        },
        {
            path:"succeeds",
            component: SuccessStoriesPageComponent
        },
        {
            path:"succeed/:id",
            component: DetailSuccessStoryComponent,
            resolve:{
              successCase: SuccessCaseDetailResolverService
            }
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuccessCaseRoutingModule {}
