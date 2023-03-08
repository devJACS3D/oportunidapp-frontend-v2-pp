import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembershipsComponent } from './components/memberships.component';
import { MembershipListComponent } from './components/membership-list/membership-list.component';

const routes: Routes = [
  {
    path: "",
    component: MembershipsComponent,
    children: [
      {
        path: "list",
        component: MembershipListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipRoutingModule { }
