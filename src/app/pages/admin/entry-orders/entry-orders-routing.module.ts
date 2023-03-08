import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PreCreateEntryOrderResolverService } from "@services/resolvers/preCreateEntryOrder.service";
import { EntryOrdersListComponent } from "./components/entry-orders-list/entry-orders-list.component";
import { EntryOrdersComponent } from "./components/entry-orders.component";
import { SaveEntryOrderComponent } from "./components/save-entry-order/save-entry-order.component";

const routes: Routes = [
  {
    path: "",
    component: EntryOrdersComponent,
    children: [
      {
        path: "list",
        component: EntryOrdersListComponent
      },
      {
        path: "create/:id",
        component: SaveEntryOrderComponent,
        resolve:{
          data: PreCreateEntryOrderResolverService
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryOrdersRoutingModule {}
