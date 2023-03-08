import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PaginationModule } from "src/app/components/pagination/pagination.module";
import { PageHeaderModule } from "src/app/components/page-header/page-header.module";
import { FiltersModule } from "src/app/components/filters/filters.module";
import { FloatingButtonsModule } from "src/app/components/floating-buttons/floating-buttons.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SkillsRoutingModule } from "./skills-routing.module";
import { FormSkillsComponent } from "./components/form-skills/form-skills.component";
import { SkillListComponent } from "./components/skill-list/skill-list.component";
import { SkillsComponent } from "./components/skills.component";
import { ConfirmationModule } from "src/app/components/confirmation/confirmation.module";
import { FieldErrorModule } from "src/app/components/field-error/field-error.module";

@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    PageHeaderModule,
    FiltersModule,
    FloatingButtonsModule,
    ReactiveFormsModule,
    SkillsRoutingModule,
    ConfirmationModule,
    FieldErrorModule
  ],
  declarations: [FormSkillsComponent, SkillListComponent, SkillsComponent]
})
export class SkillsModule {}
