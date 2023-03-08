import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupBusinessListComponent } from "./components/group-business-list/group-business-list.component";
import { GroupBusinessComponent } from "./group-business.component";
console.log()

const routes: Routes = [

  {
    path:"",
    component: GroupBusinessComponent,
    children:[
      {
        path:"list",
        component: GroupBusinessListComponent
      },
      {
        path:"workers",
        loadChildren: `../group-business-worker/group-business-worker.module#GroupBusinessWorkerModule`
      }
    ]
  }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupBusinessRoutingModule {}
