import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Utilities } from "@utils/utilities";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-print-judicial-background",
  templateUrl: "./print-judicial-background.component.html",
  styleUrls: ["./print-judicial-background.component.scss"]
})
export class PrintJudicialBackgroundComponent implements OnInit {
  utils = Utilities;
  title = "Validación de antecedentes judiciales";
  judicialBackground$: Observable<any>;
  headers = ["Concepto", "Aprobada"];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.judicialBackground$ = this.activatedRoute.data.pipe(
      map(data => data.testData),
      tap(res => console.log(res))
    );
  }

  print() {
    window.print();
  }
}
