import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { ChartDataSets, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { BehaviorSubject, merge, Observable, of, Subject } from "rxjs";
import {
  catchError,
  delay,
  finalize,
  map,
  mapTo,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";

@Component({
  selector: "app-statistics-indicator",
  templateUrl: "./statistics-indicator.component.html",
  styleUrls: ["./statistics-indicator.component.scss"]
})
export class StatisticsIndicatorComponent implements OnInit {
  statisticsBy = [
    "Visitas por rol",
    "Inicio de sesión",
    "Páginas más visitadas",
    "Sectores - vacantes",
    "Sectores - usuarios"
  ];
  statisticsByControl = new FormControl(0);
  filters$: Subject<object> = new Subject();
  public data$: Observable<any>;
  public dataLoging$: Observable<any>;
  public dataVisitByRole$: Observable<any>;
  public dataPagesVisited$: Observable<any>;
  public vacancySectors$: Observable<any>;
  public userSectors$: Observable<any>;
  public loading$ = new Subject<boolean>();
  public bgColors = [
    "#198ac494",
    "#ebcc68b5",
    "#9976e2bd",
    "#28b73aa6",
    "#fc6f6fab",
    "#795548c7",
    "#06bb81bd"
  ];
  public chartBarOptions: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  public chartBarColors: any = [
    {
      backgroundColor: this.bgColors,
      borderWidth: 1
    }
  ];
  constructor(private api: Api) {}

  ngOnInit() {
    this.loading$.next(true);
    this.statisticsByControl.valueChanges.subscribe(res => {
      this.loading$.next(true);
    });

    this.dataLoging$ = this.filters$.pipe(
      startWith({}),
      switchMap(filters => this.getLoginStatistics(filters))
    );

    this.dataVisitByRole$ = this.filters$.pipe(
      startWith({}),
      switchMap(filters => this.getVisitsByRole(filters))
    );

    this.dataPagesVisited$ = this.filters$.pipe(
      startWith({}),
      switchMap(filters => this.getPagesVisited(filters))
    );

    this.vacancySectors$ = this.filters$.pipe(
      startWith({}),
      switchMap(filters => this.getVacancySectorStatistics(filters))
    );

    this.userSectors$ = this.filters$.pipe(
      startWith({}),
      switchMap(filters => this.getUserSectorStatistics(filters))
    );
  }

  filter(data) {
    this.filters$.next(data);
  }
  getLoginStatistics(filters?: object) {
    return this.api
      .get(`${Entities.newStatistics}/logins`, null, null, null, filters)
      .pipe(
        finalize(() => this.loading$.next(false)),
        map(res => {
          const data = res.response.map(val => ({
            label: val.name,
            progress: parseFloat(val.avg) / 60, //converting to hours
            tooltip: this.convertMinutesToTimeStr(val.avg)
          }));
          return {
            data
          };
        }),
        catchError(error => {
          console.log(error);
          return of(error);
        })
      );
  }

  disableLoading() {}

  getVisitsByRole(filters?: object) {
    return this.api
      .get(`${Entities.newStatistics}/visits/roles`, null, null, null, filters)
      .pipe(
        finalize(() => this.loading$.next(false)),
        map(res => {
          return {
            datasets: [
              {
                data: res.response.map(value => value.visits),
                barThickness: 15,
                label: "Roles"
              }
            ],
            labels: res.response.map(value =>
              value.name.replace("Usuario tercero", "Agente")
            )
          };
        })
      );
  }

  getPagesVisited(filters?: object) {
    return this.api
      .get(
        `${Entities.newStatistics}/list/pagesVisited`,
        null,
        null,
        null,
        filters
      )
      .pipe(
        finalize(() => this.loading$.next(false)),
        map(res => {
          return {
            datasets: [
              {
                data: res.response.map(value => value.visits),
                barThickness: 15,
                label: "Páginas de Oportunidapp"
              }
            ],
            labels: res.response.map(value => value.page)
          };
        })
      );
  }

  getVacancySectorStatistics(filters?: object) {
    return this.api
      .get(
        `${Entities.newStatistics}/sectors/vacancies`,
        null,
        null,
        null,
        filters
      )
      .pipe(
        finalize(() => this.loading$.next(false)),
        map(res => {
          const data = res.response.map(val => ({
            label: val.name,
            progress: val.total,
            tooltip: `Coincidencias: ${val.total}`
          }));
          return {
            data
          };
        })
      );
  }

  getUserSectorStatistics(filters?: object) {
    return this.api
      .get(`${Entities.newStatistics}/sectors/users`, null, null, null, filters)
      .pipe(
        finalize(() => this.loading$.next(false)),
        map(res => {
          const data = res.response.map(val => ({
            label: val.name,
            progress: val.total,
            tooltip: `Coincidencias: ${val.total}`
          }));
          return {
            data
          };
        })
      );
  }

  convertMinutesToTimeStr(fullMinutesStr: string) {
    const fullMinutes = parseFloat(fullMinutesStr);
    const hours = Math.floor(fullMinutes / 60); //getting hours;
    const minutes = Math.floor(fullMinutes - (hours * 3600) / 60);
    const seconds = Math.floor(fullMinutes * 60 - hours * 3600 - minutes * 60);

    const padHours = Math.floor(hours)
      .toString()
      .padStart(2, "0");
    const padMinutes = Math.floor(minutes)
      .toString()
      .padStart(2, "0");
    const padSeconds = Math.floor(seconds)
      .toString()
      .padStart(2, "0");
    return `${padHours}:${padMinutes}:${padSeconds}`;
  }
}
