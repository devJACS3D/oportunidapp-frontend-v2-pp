import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MembershipsComponent } from "./components/memberships.component";
import { MembershipListComponent } from "./components/membership-list/membership-list.component";
import { MembershipRoutingModule } from "./membership-routing.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { SaveMembershipComponent } from "./components/save-membership/save-membership.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { ModalService } from "src/app/components/modal/modal.service";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";

@NgModule({
  imports: [
    CommonModule,
    MembershipRoutingModule,
    PageHeaderModule,
    PaginationModule,
    FloatingButtonsModule,
    ReactiveFormsModule,
    TextMaskModule,
    FieldErrorModule
  ],
  providers:[ModalService],
  declarations: [MembershipsComponent, MembershipListComponent,SaveMembershipComponent],
  entryComponents:[SaveMembershipComponent]
})
export class MembershipModule {}
