import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GroupBusinessComponent } from "./group-business.component";
import { GroupBusinessRoutingModule } from "./group-business-routing.module";
import { GroupBusinessListComponent } from "./components/group-business-list/group-business-list.component";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { SaveGroupBusinessFormComponent } from "./components/save-group-business-form/save-group-business-form.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { ReactiveFormsModule } from "@angular/forms";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";

@NgModule({
  imports: [
    CommonModule,
    GroupBusinessRoutingModule,
    PaginationModule,
    PageHeaderModule,
    FloatingButtonsModule,
    ReactiveFormsModule,
    FieldErrorModule
  ],
  declarations: [
    GroupBusinessComponent,
    GroupBusinessListComponent,
    SaveGroupBusinessFormComponent
  ],
  providers:[ModalService],
  entryComponents:[
    SaveGroupBusinessFormComponent
  ]
})
export class GroupBusinessModule {}
