import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StatisticsGraphicComponent } from "./components/statistics-graphic/statistics-graphic.component";
import { StatisticsIndicatorComponent } from "./components/statistics-indicator/statistics-indicator.component";
import { StatisticsComponent } from "./components/statistics.component";

const routes: Routes = [
  {
    path: "",
    component: StatisticsComponent,
    children:[
      {
        path:"main",
        component: StatisticsGraphicComponent
      },
      {
        path:"indicators",
        component: StatisticsIndicatorComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule {}
