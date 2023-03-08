import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "statistic-card",
  templateUrl: "./statistic-card.component.html",
  styleUrls: ["./statistic-card.component.scss"]
})
export class StatisticCardComponent implements OnInit {

  @Input() count: string = "";
  @Input() keyword: string = "";
  @Input() title: string = "";
  @Input() subTitle: string = "";
  @Input() progressColor: string = "";
  @Input() seeMore: boolean = false;
  @Input() percent: number = 0;
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() { }
}
