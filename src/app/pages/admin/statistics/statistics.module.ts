import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StatisticsComponent } from "./components/statistics.component";
import { StatisticsRoutingModule } from "./statistics-routing.module";
import { StatisticsGraphicComponent } from "./components/statistics-graphic/statistics-graphic.component";
import { TabsModule } from "src/app/components/tabs/tabs.module";
import { StatisticCardComponent } from "./components/statistic-card/statistic-card.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { StatisticsIndicatorComponent } from "./components/statistics-indicator/statistics-indicator.component";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { FiltersModule } from "src/app/components/filters/filters.module";
import { ChartsModule } from "ng2-charts";
import { CustomChartsModule } from "src/app/components/charts/charts.module";

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    TabsModule,
    NgCircleProgressModule.forRoot(),
    NgbDatepickerModule,
    ReactiveFormsModule,
    FiltersModule,
    ChartsModule,
    CustomChartsModule
  ],
  declarations: [
    StatisticsComponent,
    StatisticsGraphicComponent,
    StatisticCardComponent,
    StatisticsIndicatorComponent
  ]
})
export class StatisticsModule {}
