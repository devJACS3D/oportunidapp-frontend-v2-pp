import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SkillResolverService } from "@services/resolvers/skills.service";
import { FormSkillsComponent } from "./components/form-skills/form-skills.component";
import { SkillListComponent } from "./components/skill-list/skill-list.component";
import { SkillsComponent } from "./components/skills.component";

const routes: Routes = [
  {
    path: "",
    component: SkillsComponent,
    children: [
      {
        path: "list",
        component: SkillListComponent,
        resolve: {
          skills: SkillResolverService
        }
      },
      { path: "create", component: FormSkillsComponent },
      { path: "edit/:id", component: FormSkillsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule {}
