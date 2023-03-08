import { Component, OnInit } from "@angular/core";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { interval } from "rxjs";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent implements OnInit {
  constructor(private apiEval: ApiEvaluatest) {}

  ngOnInit() {
    interval(120000).subscribe(() => {
      this.apiEval.login();
    });
  }
}
