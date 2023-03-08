import { Component, Input, OnInit } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { Color, Label } from "ng2-charts";

@Component({
  selector: "bars-pt",
  templateUrl: "./bars-pt.component.html",
  styleUrls: ["./bars-pt.component.scss"]
})
export class BarsPtComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }
      ]
    }
  };

  @Input() chartLabels: Label[] = [];
  @Input() chartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  @Input() chartData: ChartDataSets[] = [];
  constructor() {}

  ngOnInit() {}
}
