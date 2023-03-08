import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GroupBusinessWorkerComponent } from "./group-business-worker.component";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { ReactiveFormsModule } from "@angular/forms";
import { GroupBusinessWorkerRoutingModule } from "./group-business-worker-routing.module";
import { ModalService } from "src/app/components/modal/modal.service";
import { GroupBusinessWorkerListComponent } from "./components/group-business-worker-list/group-business-worker-list.component";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { GroupBusinessWorkerFormComponent } from "./components/group-business-worker-form/group-business-worker-form.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    PageHeaderModule,
    ReactiveFormsModule,
    GroupBusinessWorkerRoutingModule,
    FloatingButtonsModule,
    NgSelectModule,
    FieldErrorModule
  ],
  providers: [ModalService],
  declarations: [
    GroupBusinessWorkerComponent,
    GroupBusinessWorkerListComponent,
    GroupBusinessWorkerFormComponent
  ],
  entryComponents:[
    GroupBusinessWorkerFormComponent
  ]
})
export class GroupBusinessWorkerModule {}
