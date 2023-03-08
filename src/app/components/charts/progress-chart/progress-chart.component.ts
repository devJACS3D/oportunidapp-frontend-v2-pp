import { Component, Input, OnInit } from "@angular/core";
import { IProgressChartDataSet } from "@apptypes/entities/charts";

@Component({
  selector: "app-progress-chart",
  templateUrl: "./progress-chart.component.html",
  styleUrls: ["./progress-chart.component.scss"]
})
export class ProgressChartComponent implements OnInit {
  @Input() datasets: IProgressChartDataSet[] = [];
  @Input() showCount: boolean = true;
  @Input() percentage: string = "%";
  @Input() radious: string = "10px";
  @Input() height: string = "10px";
  @Input() backgroundColors: string[] = [];
  @Input() textColor: string = "#1A8AC4";
  constructor() {}

  ngOnInit() {}

  setBackgroundColor(position: number, limit: number) {
    const bgDefault = "#198ac4";
    if (!limit || limit <= 0) return bgDefault;
    if (this.backgroundColors.length <= 0) return bgDefault;
    return this.backgroundColors.slice(0, limit)[position];
  }
}
