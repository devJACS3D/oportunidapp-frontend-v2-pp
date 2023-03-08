import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IPagination } from "@apptypes/pagination";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS, STATUS } from "src/app/constants/constants";

@Component({
  selector: "app-personality-test-list",
  templateUrl: "./personality-test-list.component.html",
  styleUrls: ["./personality-test-list.component.scss"]
})
export class PersonalityTestListComponent implements OnInit {
  title: string = "Pruebas de personalidad";
  tableHeaders = ["Usuario", "Estado", "Sectores"];
  public statusFilters = [
    { name: "Realizada", value: 2 },
    { name: "Pendiente", value: 1 }
  ];
  personalityTests$: Observable<any[]>;
  private paginationOpts$ = new BehaviorSubject({ page: 1, filters: {} });
  private itemsPerPage: number = 10;
  private _pagination: IPagination;
  public loadingPage: boolean;
  utils = Utilities;
  constructor(
    private api: Api,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.personalityTests$ = this.paginationOpts$.pipe(
      tap(() => (this.loadingPage = true)),
      switchMap(opts => this.fetchData(opts))
    );
  }
  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    };
  }
  get pagination() {
    return this._pagination;
  }

  /* ................................................................................................. */
  /* FETCHS */
  /* ................................................................................................. */
  public fetchData(pageOpts: { page: number; filters: Object }) {
    const { page, filters } = pageOpts;

    return this.api
      .get(
        Entities.adminPersonalityTests,
        null,
        page,
        this.itemsPerPage,
        filters
      )
      .pipe(
        tap(response => (this.pagination = response.response)),
        map(response => response.response.data || []),
        finalize(() => (this.loadingPage = false)),
        catchError(() => of([]))
      );
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());
    this.itemsPerPage = event.itemsPerPage;

    const prevValues = this.paginationOpts$.getValue();
    this.paginationOpts$.next({
      ...prevValues,
      page: event.pageNumber
    });
  }

  searchFilter(filterOpts: { searchQuery: string; statusId?: number }) {
    this.paginationOpts$.next({
      page: 1,
      filters: {
        ...filterOpts
      }
    });
  }

  async printTest(test: any) {
    if (test.status.id !== STATUS.DONE) {
      return this.infoAlert(
        `El usuario ${test.user.fullName} no ha realizado la prueba de personalidad.`
      );
    }

    let scale: string = "general";

    if (test.user.maritalGenderId) {
      scale = await this.selectGender(
        `Por favor seleccione un baremo para el usuario ${test.user.fullName}`,
        test.user.maritalGenderId
      );
    }
    this.router.navigate([`print/personalityTest/${test.user.id}`], {
      queryParams: { scale: scale }
    });
  }

  infoAlert(message) {
    const alert = this.alert.customAlert({
      autoClose: false,
      title: "Prueba de personalidad",
      message,
      bgColor: COLORS.WARNING,
      icon: COLORS.WARNING,
      bgTop: true,
      buttons: [
        {
          name: "Entendido",
          onClick: () => this.alert.closeAlert(),
          class: "primary-default"
        }
      ]
    });
  }

  selectGender(message, maritalGenderId): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const alert = this.alert.customAlert({
        autoClose: false,
        title: "Prueba de personalidad",
        message,
        bgColor: COLORS.SUCCESS,
        icon: COLORS.SUCCESS,
        closeBackDrop: true,
        bgBottom: true,
        buttons: [
          {
            name: `${maritalGenderId == 1 ? "Mujeres" : "Hombres"}`,
            onClick: () => {
              resolve(maritalGenderId == 1 ? "women" : "men");
              this.alert.closeAlert();
            },
            class: "primary-default"
          },
          {
            name: "General",
            onClick: () => {
              resolve("general");
              this.alert.closeAlert();
            },
            class: "primary-default"
          }
        ]
      });
    });
  }
}
