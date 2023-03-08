import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GroupBusinessWorkerListComponent } from "./components/group-business-worker-list/group-business-worker-list.component";
import { GroupBusinessWorkerComponent } from "./group-business-worker.component";

const routes: Routes = [
  {
    path: "",
    component: GroupBusinessWorkerComponent,
    children:[
      {
        path:"list/:id",
        component: GroupBusinessWorkerListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupBusinessWorkerRoutingModule {}
