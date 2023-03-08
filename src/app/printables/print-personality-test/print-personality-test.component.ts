import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  DataScore,
  DataScoreValue,
  Grade,
  PersonalityTestDataScore
} from "@apptypes/entities/personalityTestScore";
import { ITestApplyment } from "@apptypes/entities/test";
import { Utilities } from "@utils/utilities";
import { ChartDataSets } from "chart.js";
import { Color, Label } from "ng2-charts";
import { Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";

@Component({
  selector: "app-print-personality-test",
  templateUrl: "./print-personality-test.component.html",
  styleUrls: ["./print-personality-test.component.scss"]
})
export class PrintPersonalityTestComponent implements OnInit {
  grades = Grade;
  headers = [
    "Factores",
    "PD",
    "PC",
    "PT",
    "Muy bajo",
    "Bajo",
    "Promedio",
    "Alto",
    "Muy Alto"
  ];
  headersFactorsTwo = ["Factores", "Nivel Factor", "Comentarios"];
  headersFacet = [
    "",
    "Facetas",
    "PD",
    "PC",
    "PT",
    "Muy bajo",
    "Bajo",
    "Promedio",
    "Alto",
    "Muy Alto"
  ];
  utils = Utilities;
  personalityTest: PersonalityTestDataScore;
  test$: Observable<ITestApplyment>;
  description$: Observable<string>;
  factors$: Observable<DataScore[]>;
  facets$: Observable<DataScoreValue | any[]>;
  description: string;
  distortion: object;

  factorDataSets$: Observable<ChartDataSets[]>;
  factorLabels: Label[];

  barsChartColor: Color[] = [
    { backgroundColor: "#00528c" },
    { backgroundColor: "#76AEDB" }
  ];
  radarChartColor: Color[] = [
    { backgroundColor: "#00528c78", borderColor: "#00528c" },
    { backgroundColor: "#76aedbbf", borderColor: "#76AEDB" }
  ];
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.test$ = this.activatedRoute.data.pipe(
      map(res => {
        if (res.testData && res.testData.test) {
          return res.testData.test;
        }
        return null;
      })
    );

    this.description$ = this.activatedRoute.data.pipe(
      map(res => res.testData),
      map(res => {
        return this.getDescription(res);
      })
    );

    this.factors$ = this.activatedRoute.data.pipe(
      map(res => res.testData),
      map(res => res.data),
      shareReplay(1)
    );

    this.factorDataSets$ = this.factors$.pipe(
      tap(data => this.setFactorLabels(data)),
      map(data => this.getDataSet(data))
    );
  }

  getDataSet(data: DataScore[]): ChartDataSets[] {
    return [
      {
        label: "Puntuación T",
        data: data.map(d => d.value.pt),
        backgroundColor: "rgba(105, 165, 215,0.4)",
        borderColor: "rgba(105, 165, 215,1)",
        hoverBackgroundColor: "rgba(105, 165, 215,0.8)",
        hoverBorderColor: "rgba(105, 165, 215,1)",
        pointBackgroundColor: "rgba(105, 165, 215,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "fff",
        pointHoverBorderColor: "rgba(255,99,132,0.8)"
      },
      {
        label: "Puntuación Centil",
        data: data.map(d => d.value.pc),
        backgroundColor: "rgba(15, 90, 144,0.4)",
        borderColor: "rgba(15, 90, 144,1)",
        hoverBackgroundColor: "rgba(15, 90, 144,0.8)",
        hoverBorderColor: "rgba(15, 90, 144,1)",
        pointBackgroundColor: "rgba(15, 90, 144,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "fff",
        pointHoverBorderColor: "rgba(255,99,132,0.8)"
      }
    ];
  }

  setFactorLabels(data: DataScore[]): Label[] {
    this.factorLabels = data.map(d => d.value.name);
    return this.factorLabels;
  }

  private getDescription(personalityTest: PersonalityTestDataScore): string {
    const highFactors = personalityTest.data.filter(
      f =>
        f.value.grade == this.grades.Alto ||
        f.value.grade == this.grades.MuyAlto
    );
    const lowFactors = personalityTest.data.filter(
      f =>
        f.value.grade == this.grades.Bajo ||
        f.value.grade == this.grades.MuyBajo
    );

    const distortion = personalityTest.data.find(
      factor => factor.factor === "D"
    );
    const fullName = personalityTest.test.user.fullName;

    const contentHighFactor = this.getHighFactorDescription(
      highFactors,
      fullName
    );
    const contentLowFactor = this.getLowFactorDescription(lowFactors, fullName);
    return `${contentHighFactor} ${
      contentHighFactor.length > 1 && contentLowFactor.length > 1
        ? "Por otro lado, "
        : ""
    } ${contentLowFactor} Finalmente es posible evidenciar que ${
      distortion.value.text
    }.`;
  }

  private getHighFactorDescription(factors: DataScore[], fullName: string) {
    if (!factors.length) return "";
    let str = `es una persona que se caracteriza principalmente por tener niveles muy altos de:`;
    const connectors = [
      "Esto conlleva a que",
      "adicionalmente a que",
      "tambien a que",
      "tambien a que",
      "tambien a que"
    ];
    let descriptionText = "";

    const factorsWithOutDistortion = factors.filter(f => f.factor !== "D");

    factorsWithOutDistortion.forEach((f, index) => {
      str += ` ${index + 1}) ${f.value.name}${
        index + 1 == factors.length ? "." : ", "
      }`;
      descriptionText += ` ${connectors[index]} ${f.value.text.toLowerCase()}${
        index + 1 == factors.length ? "." : ";"
      }`;
    });

    if (descriptionText.trim().length === 0) return "";
    return `${fullName} ${str} ${descriptionText}`;
  }

  private getLowFactorDescription(factors: DataScore[], fullName: string) {
    if (!factors.length) return "";
    let str = `${fullName} suele presentar bajos niveles de `;

    factors.forEach((f, index) => {
      str += `${index + 1}) ${f.value.name}${
        index + 1 == factors.length ? "." : ", "
      }`;
    });
    return str;
  }

  getComments(factor: DataScore) {
    let str = `De acuerdo con las respuestas dadas por el usuario, `;

    factor.value.facets.forEach((facet, index) => {
      str += `${facet.text} y se encuentra por encima del ${
        facet.pc
      }% de la población. ${
        factor.value.facets[index + 1] ? " Adicionalmente " : ""
      }`;
    });

    return str;
  }

  print() {
    window.print();
  }
}
