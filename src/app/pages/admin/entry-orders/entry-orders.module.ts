import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EntryOrdersComponent } from "./components/entry-orders.component";
import { EntryOrdersListComponent } from "./components/entry-orders-list/entry-orders-list.component";
import { SaveEntryOrderComponent } from "./components/save-entry-order/save-entry-order.component";
import { EntryOrderFormComponent } from "./components/forms/entry-order-form.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { TextMaskModule } from "angular2-text-mask";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { EntryOrdersRoutingModule } from "./entry-orders-routing.module";
import { VappStatusModule } from "src/app/components/vapp-status/vapp-status.module";
import { FiltersModule } from "src/app/components/filters/filters.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { CardModule } from "src/app/components/card/card.module";
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    TextMaskModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    VappStatusModule,
    EntryOrdersRoutingModule,
    PageHeaderModule,
    FiltersModule,
    PaginationModule,
    CardModule
  ],
  declarations: [
    EntryOrdersComponent,
    EntryOrdersListComponent,
    SaveEntryOrderComponent,
    EntryOrderFormComponent,
  ]
})
export class EntryOrdersModule {}
