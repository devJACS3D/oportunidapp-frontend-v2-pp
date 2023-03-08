import { Component, OnInit } from "@angular/core";
import { IPagination } from "@apptypes/pagination";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";
import { IFilter } from "@apptypes/entities/IFilter";
import { IUser } from "@apptypes/entities/IUser";
import filters from "@utils/filterOpts";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import {
  catchError,
  finalize,
  map,
  skip,
  switchMap,
  tap
} from "rxjs/operators";
import { UserAccountService } from "@services/user-account.service";
import { ILaboralExperience } from "@apptypes/entities/ILaboralExperience";
import * as moment from "moment";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { FilterType } from "@apptypes/enums/filterTypeEnum";
import { LocalStorageService } from "@services/local-storage.service";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-candidates-list",
  templateUrl: "./candidates-list.component.html",
  styleUrls: ["./candidates-list.component.scss"]
})
export class CandidatesListComponent implements OnInit {
  public loadingDesRep: boolean;
  public idVacante: number;

  filterType = FilterType.candidateFilters;
  utils = Utilities;
  title$: Observable<string>;
  tableHeaders = ["", "Nombre", "Años", "Nivel de estudios", "Descargas"];
  loadingPage: boolean;
  itemsPerPage: number = 10;
  pagination: IPagination;
  vidStatusFilters: { vid: number; vacancyApplymentStatusId: number };
  paginationFilterOpts$: BehaviorSubject<{
    page: number;
    filters: Object;
  }> = new BehaviorSubject({ page: 1, filters: {} });
  candidates$: Observable<any[]>;
  rankCandidatosEval: any[];
  showInfComparativo: boolean = false;
  candidatesSendComp: any[];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _api: Api,
    private _apiEval: ApiEvaluatest,
    public localStorage: LocalStorageService,
    private userAccount: UserAccountService,
    private config: NgbDropdownConfig
  ) {}

  async ngOnInit() {
    this.config.autoClose = false;
    this.idVacante = this._activatedRoute.snapshot.params.vac;
    await this.candidatosVacanteSel();
    // this.downloadRepComparativo();

    const params$ = this._activatedRoute.params.pipe(
      tap(
        params =>
          (this.vidStatusFilters = {
            vacancyApplymentStatusId: params.status,
            vid: params.vid
          })
      ),
      map(() => ({
        page: 1,
        filters: this.localStorage.getFilterItem(this.filterType)
      }))
    );

    const filters$ = this.paginationFilterOpts$.pipe(
      skip(1),
      tap(opts =>
        this.localStorage.setFilterItem(this.filterType, opts.filters)
      )
    );

    this.candidates$ = merge(params$, filters$).pipe(
      tap(() => (this.loadingPage = true)),
      switchMap(opts => this.fetchData2(opts))
    );

    this.title$ = this._activatedRoute.params.pipe(map(param => param.title));
  }

  fetchData2(opts: { page: number; filters: Object }) {
    this.loadingPage = true;
    const { filters } = opts;
    return this._api
      .get(this.getUserUrl(), null, opts.page, this.itemsPerPage, {
        ...this.vidStatusFilters,
        ...filters
      })
      .pipe(
        tap(res => (res.response["currentPage"] = opts.page)),
        tap(response => (this.pagination = response.response)),
        map(response => {
          const data = response.response.data;
          const rank: any = this.rankCandidatosEval;
          return !filters["yearsExperience"]
            ? data.map(cand => {
                rank.JPCM.forEach(async rankCan => {
                  if (cand.user.credentialUser.email == rankCan.M) {
                    cand.user.afinidad =
                      rankCan.A == 0.0 ? "En proceso" : rankCan.A;
                    cand.user.idCandEval = rankCan.CID;
                    cand.user.indAfin = await this.verificarReportes(
                      this.idVacante,
                      rankCan.CID,
                      "indAfin"
                    );

                    cand.user.diagPotCla = await this.verificarReportes(
                      this.idVacante,
                      rankCan.CID,
                      "diagPotCla"
                    );

                    cand.user.autBio = await this.verificarReportes(
                      this.idVacante,
                      rankCan.CID,
                      "autBio"
                    );
                    return;
                  } else {
                    cand.user.afinidad = "En proceso";
                  }
                });
                // lo muestro en consola pero no se inserta
                return cand;
              }) || []
            : this.filterByYearsOfExperience(data, filters["yearsExperience"]);
        }),
        finalize(() => (this.loadingPage = false)),
        catchError(err => of([]))
      );
  }

  filterByYearsOfExperience(data: IVacancyApplyment[], years?: number): any[] {
    return data.filter(vap => {
      const totalYears = this.getYearsOfExperience(vap.user.laboralExperiences);
      if (totalYears >= Number(years)) {
        return vap;
      }
    });
  }

  private getYearsOfExperience(laboralExperiences: ILaboralExperience[]) {
    const totalYears = laboralExperiences.reduce((reducer, current) => {
      return (
        reducer +
        moment(current.finishDate ? current.finishDate : new Date()).diff(
          current.startDate,
          "years"
        )
      );
    }, 0);
    return totalYears;
  }

  private getUserUrl() {
    const user = this.userAccount.getUser();
    return user.isBusinessProfile
      ? Entities.companyVacancyApplyments
      : Entities.vacancyApplyments;
  }

  applyFilter(filters: IFilter) {
    this.paginationFilterOpts$.next({
      filters: filters.map,
      page: 1
    });
  }
  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    const prevVals = this.paginationFilterOpts$.getValue();
    this.paginationFilterOpts$.next({
      ...prevVals,
      page: event.pageNumber
    });
  }

  public getStudieLevel(user: IUser) {
    let studyLevelName = "No registrado";
    if (user.academicTitlesUsers.length === 0) return studyLevelName;

    const maximum = user.academicTitlesUsers.reduce((acc, value) => {
      if (Math.max(acc.studiesLevel.id, value.studiesLevel.id)) {
        return acc;
      }
    });
    studyLevelName = maximum.studiesLevel.name;

    return studyLevelName;
  }

  public gotoUserView(candidate) {
    this._router.navigate(
      [
        `../../../../../user/${candidate.id}/${this.idVacante}/${candidate.user.idCandEval}`
      ],
      {
        relativeTo: this._activatedRoute
      }
    );
  }

  public calculateAge(date): number {
    const today: Date = new Date();
    const birthDate: Date = new Date(date);
    let age: number = today.getFullYear() - birthDate.getFullYear();
    return age;
  }

  /* ................................................................................................. */
  /* FILTER SHOW OPTS */
  /* ................................................................................................. */
  get filterOpts() {
    return filters.userFilters;
  }

  public async candidatosVacanteSel() {
    let pathUrl = `ranking/v1/jobProfile/${this.idVacante}`;
    this.rankCandidatosEval = await this._apiEval
      .getCandidatos(pathUrl)
      .toPromise();
  }

  async verificarReportes(idVac, idCand, nomRep) {
    const listRep: any = [
      {
        indAfin: `affinity/v1/jobprofile/${idVac}/candidate/${idCand}/language/es`,
        diagPotCla: `potential/v1/candidateId/${idCand}/vacant/${idVac}`,
        autBio: `report/${idVac}/jobProfile/${idCand}/candidate/incident`
      }
    ];

    const path = listRep[0][nomRep];
    let resp: any;
    nomRep == "autBio"
      ? (resp = await this._apiEval.headReporteAlt(path).toPromise())
      : (resp = await this._apiEval.headReporte(path).toPromise());
    return resp;
  }

  mostrarInformeComparativo(info) {
    this.candidatesSendComp = info;
    this.showInfComparativo = true;
  }

  closeModalComparativo($event) {
    this.showInfComparativo = false;
  }

  /*-------------------------------------
  DESCARGAS DE REPORTES 
  --------------------------------------*/
  // descargar reporte de afinidad
  public downloadRepAfinidad(idVac, idCand) {
    this.loadingDesRep = true;
    let pathUrl = `affinity/v1/jobprofile/${idVac}/candidate/${idCand}/language/es`;

    this._apiEval.getReporteDescarga(pathUrl).subscribe(
      respDesAfi => {
        // se recibe en base64 y se decodifica
        const byteCharacters = atob(respDesAfi);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte-afinidad.pdf";
        link.click();
        this.loadingDesRep = false;
      },
      error => {
        console.log(error);
        this.loadingDesRep = false;
      }
    );
  }

  // funcion para descargar reporte de diagnostico clasico
  public downloadRepDiagPotencialClas(idVac, idCand) {
    this.loadingDesRep = true;
    let pathUrl = `potential/v1/candidateId/${idCand}/vacant/${idVac}`;

    this._apiEval.getReporteDescarga(pathUrl).subscribe(
      respDesAfi => {
        // se recibe en base64 y se decodifica
        const byteCharacters = atob(respDesAfi);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte-diagnostico-potencial.docx";
        link.click();
        this.loadingDesRep = false;
      },
      error => {
        console.log(error);
        this.loadingDesRep = false;
      }
    );
  }

  //  Descargar Autenticacion biometrica facial
  public downloadAutBiomFacial(idVac, idCand) {
    this.loadingDesRep = true;
    let pathUrl = `report/${idVac}/jobProfile/${idCand}/candidate/incident`;

    this._apiEval.getReporteDescargaAlt(pathUrl).subscribe(
      respDesAuth => {
        // se recibe en base64 y se decodifica
        const byteCharacters = atob(respDesAuth);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/pdf"
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte-autenticacion-facial.pdf";
        link.click();
        this.loadingDesRep = false;
      },
      error => {
        console.log(error);
        this.loadingDesRep = false;
      }
    );
  }

  // descargar diagnostico de potencial
  public downloadDiagPotencial(idVac, idCand) {
    this.loadingDesRep = true;
    let itemaDiag: any = document.querySelectorAll(
      '#incluirPDF input[type="checkbox"]'
    );

    let grafica = itemaDiag[0].checked;
    let tblResu = itemaDiag[1].checked;
    let interpret = itemaDiag[2].checked;

    let pathUrl = `VacantCandidates/candidate/${idCand}/vacant/${idVac}/graphics/${grafica}/tables/${tblResu}/interpretations/${interpret}/variables/pdf`;

    this._apiEval.getReporteDescargaAlt(pathUrl).subscribe(
      respDesAuth => {
        // se recibe en base64 y se decodifica
        const byteCharacters = atob(respDesAuth);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/pdf"
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte-diagnostico-potencial.pdf";
        link.click();
        this.loadingDesRep = false;
      },
      error => {
        console.log(error);
        this.loadingDesRep = false;
      }
    );
  }
}
