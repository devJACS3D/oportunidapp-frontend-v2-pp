import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgbTooltipModule
  ],
  declarations: [ProgressChartComponent],
  exports: [ProgressChartComponent],
})
export class CustomChartsModule { }
