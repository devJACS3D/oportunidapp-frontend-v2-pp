import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiResponse } from "@apptypes/api-response";
import { IFilterValues, IFilter } from "@apptypes/entities/IFilter";
import { IVacancy } from "@apptypes/entities/vacancy";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { FilterType } from "@apptypes/enums/filterTypeEnum";
import { IPagination } from "@apptypes/pagination";
import { LoggedUser } from "@apptypes/types";
import { Entities } from "@services/entities";
import { LocalStorageService } from "@services/local-storage.service";
import { UserAccountService } from "@services/user-account.service";
import { Api } from "@utils/api";
import filters from "@utils/filterOpts";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import * as jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePipe } from "@angular/common";
import { ApiEvaluatest } from "@utils/api-evaluatest";

@Component({
  selector: "app-vacancies-list",
  templateUrl: "./vacancies-list.component.html",
  styleUrls: ["./vacancies-list.component.scss"]
})
export class VacanciesListComponent implements OnInit {
  AUTHORIZED = AUTHORIZED;
  public maskCurrency: RegExp = RegexUtils._maskCurrency;
  public vacancies: IVacancy[] = [];
  public _loadingInit: boolean;
  public _loadingPage: boolean;
  public _error: any; // error loading init;

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;
  public _EntityToDelete: any; //Crear modelo de Vacancy

  public _result: any;
  public _currentPage: number = 1;
  public _ItemsPerPage: number = 10;
  public _pagination: IPagination;

  public filterParams: IFilterValues;
  public _maxDate: any;

  public currentUser: LoggedUser;
  public _businessProfile: boolean = false;

  public utils = Utilities;
  public listVacante: any[];
  public listSubcarpetas: any[];
  public listEmpresas: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private _apiEval: ApiEvaluatest,
    private alert: DialogService,
    private localStorage: LocalStorageService,
    private userAccount: UserAccountService
  ) {}

  async ngOnInit() {
    const res = await this._apiEval.login();
    this.currentUser = this.userAccount.getUser();
    this._businessProfile = this.currentUser.userTypeId == 3 ? true : false;
    this._showConfirm = false;
    this._loadingInit = true;
    this._maxDate = Utilities.formatDate(moment().unix());

    //getting stored filters
    this.filterParams = this.localStorage.getFilterItem(
      FilterType.vacancyFilters
    );

    await this.fetchData(this.filterParams);

    this._loadingInit = false;
  }

  private async fetchData(params?: Object) {
    // checking user type
    this._loadingPage = true;
    let strRequest = this._businessProfile
      ? Entities.company_vacancies
      : Entities.vacancies;
    params["published"] = 1;
    try {
      let paginatedResponse: ApiResponse = await this.api
        .get(strRequest, null, this._currentPage, this._ItemsPerPage, params)
        .toPromise();
      this.vacancies = paginatedResponse.response.data;
      await this.setVacancieAndEmpresas();

      this._pagination = {
        pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
        pagesNumber: paginatedResponse.response.pagesNumber,
        elementsNumber: paginatedResponse.response.elementsNumber,
        itemsPerPage: this._ItemsPerPage,
        currentPage: this._currentPage
      };
      this._error = null;
    } catch (error) {
      console.log(error);
      this._error = error;
    }
  }

  public addEmpresaEval() {
    try {
      this.vacancies.forEach(vac => {
        this.listEmpresas.forEach(emp => {
          if (emp.nomEmpesa == vac.company.name) {
            vac.company.idPadEval = emp.idPadreEmp;
            this.listVacante.forEach(vacEval => {
              if (emp.idPadreEmp == vacEval.idPadreEmp) {
                let idSub: number;
                this.listSubcarpetas.forEach(sub => {
                  if (sub.idPadreEmp == emp.idPadreEmp) {
                    idSub = sub.posicion;
                  }
                });
                if (vacEval.subcarpeta == idSub) {
                  if (vacEval.nombreVac == vac.name) {
                    vac.idVacEval = vacEval.idVacante;
                  }
                }
              }
            });
            return;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      this._loadingPage = false;
    }
  }

  public createVacancy() {
    this.router.navigate([`./create`], { relativeTo: this.activatedRoute });
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public removeVacancy(vacancy: IVacancy) {
    this._confirmMessage = "¿Desea eliminar la vacante " + vacancy.name + "?";
    this._showConfirm = true;
    this._EntityToDelete = vacancy;
  }

  public async confirm($event) {
    if ($event) {
      this._loadingConfirm = true;

      try {
        let strRequest: string = this._businessProfile
          ? Entities.company_vacany
          : Entities.vacancies;
        let resp = (await this.api
          .delete(strRequest, this._EntityToDelete.id)
          .toPromise()) as ApiResponse;

        // alert(resp.message);
        this.alert.successAlert(resp.message);
        // this.loadEntidades();
        await this.fetchData(this.filterParams);
      } catch (err) {
        this.alert.errorAlert(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    this._ItemsPerPage = event.itemsPerPage;
    this._currentPage = event.pageNumber;
    await this.fetchData(this.filterParams);
  }

  public async applyFilters(filters: IFilter) {
    //resetting the page before apply
    this._currentPage = 1;
    this.filterParams = filters.map ? filters.map : {};
    this.localStorage.setFilterItem(
      FilterType.vacancyFilters,
      this.filterParams
    );
    await this.fetchData(this.filterParams);
  }

  get tableHeaders() {
    if (this.currentUser.isBusinessProfile) {
      return [
        "Nombre",
        "Publicado por",
        "Fecha de publicación",
        "Fecha de contratación",
        "Hojas de vida vistas",
        ""
      ];
    }
    return [
      "Nombre",
      "Publicado por",
      "Fecha de publicación",
      "Fecha de contratación",
      "Hojas de vida vistas",
      "",
      ""
    ];
  }

  goToCompetents(vacancy: IVacancy) {
    this.router.navigate(
      [
        `../../candidates/va/8/${vacancy.id}`,
        vacancy.name,
        `${vacancy.idVacEval}`
      ],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  /* ................................................................................................. */
  /* filter opts */
  /* ................................................................................................. */
  get filterOpts() {
    if (this.currentUser.isBusinessProfile) {
      return filters.requisitionBusinessFilters;
    }
    return filters.vacancyFilters;
  }

  async confirmVacancyPublish(event, vacancy: IVacancy) {
    console.log(event.target.checked);

    const confirm = await this.alert.confirmAlert({
      message: `¿Estas seguro que deseas despublicar esta vacante? Esta acción enviará la vacante actual a requisiciones.`
    });

    if (!confirm) {
      event.target.checked = true;
      return;
    }

    this.api
      .put(`${Entities.vacancies}/publish`, { published: false }, vacancy.id)
      .subscribe(
        res => {
          this.alert.successAlert(
            "Se ha despublicado la vacante exitosamente."
          );
          this._currentPage = 1;
          this.fetchData({});
        },
        error => {
          this.alert.errorAlert(error);
          event.target.checked = true;
        }
      );
  }

  async getAllVacancies() {
    let strRequest = this._businessProfile
      ? Entities.company_vacancies
      : Entities.vacancies;
    const pagina = 1;
    const recordsNum = 0; // to get all items
    const params = { published: 1 };
    const datePipe = new DatePipe("en-US");
    try {
      let paginatedResponse: ApiResponse = await this.api
        .get(strRequest, null, pagina, recordsNum, params)
        .toPromise();
      const response = paginatedResponse.response.data;
      const responseMapped = response.map(e => ({
        Nombre: e.name,
        "Publicado Por": e.company.name,
        "Fecha de Publicacion": datePipe.transform(e.createdAt, "dd/MM/yyyy"),
        "Fecha de Contratacion": datePipe.transform(
          e.contractDate,
          "dd/MM/yyyy"
        ),
        "Hojas de Vida Vistas": e.curriculumsSeens.length + " / 100"
      }));

      return responseMapped;
    } catch (error) {
      console.log(error);
      this._error = error;
    } finally {
      this._loadingPage = false;
    }
  }
  async downloadPDF() {
    const fileName = "vacancies";
    const responseMapped = await this.getAllVacancies();
    const header = Object.keys(responseMapped[0]);
    const body = responseMapped.map(el => Object.values(el));
    const doc = new jsPDF();

    autoTable(doc, {
      head: [header],
      body
    });

    doc.save(fileName + ".pdf");
  }
  async downloadCSV() {
    const fileName = "vacancies";
    const responseMapped = await this.getAllVacancies();
    const header = Object.keys(responseMapped[0]);
    const values = responseMapped
      .map(el => Object.values(el).join(","))
      .join("\r\n");
    const csvRows = [];
    csvRows.push(header);
    csvRows.push(values);
    let csvArray = csvRows.join("\r\n");
    const blob = new Blob([csvArray], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", fileName + ".csv");
    a.click();
  }

  public async setVacancieAndEmpresas() {
    const respFold = await this._apiEval.get("unity/v1/folders").toPromise();
    await this.simplificarArray(respFold.St.EnterpriseStructureTree);
    await this.addEmpresaEval();
  }

  public simplificarArray(info) {
    let empresa = [];
    let vacEmpr = [];
    let puestos = [];

    for (let i = 0; i < info.length; i++) {
      // aqui vamos a guardar la empresa de  la vacante
      let puestoDet = info[i];
      empresa.push({
        idPadreEmp: puestoDet.Id, //se añade a la url al guardar la vacante
        idEmp: puestoDet.I, // se añade a la url de Unidad Puesto
        nomEmpesa: puestoDet.N.trim()
      });

      // verificamos si tiene vacantes o puestos
      if (puestoDet.S != null) {
        for (let j = 0; j < puestoDet.S.length; j++) {
          // si tiene vacantes las insertmos al array
          let vacante = puestoDet.S[j];
          if (vacante.T == "Vacante") {
            vacEmpr.push({
              idEmpresa: i,
              idPadreEmp: puestoDet.Id,
              nombreVac: vacante.N.trim(),
              idVacante: vacante.I,
              idVacantePadre: vacante.Id
            });
          } else if (vacante.T == "Puesto") {
            // si tiene puestos (subcarpetas) las insertamos
            let subcarpeta = vacante;
            const pos = puestos.length;

            puestos.push({
              nomPuesto: subcarpeta.N.trim(),
              posicion: pos,
              idPadreEmp: puestoDet.Id
            });

            // le añadidos las vacantes de lasubcarpeta
            if (subcarpeta.S != null) {
              for (let m = 0; m < subcarpeta.S.length; m++) {
                let vacantePue = subcarpeta.S[m];
                vacEmpr.push({
                  idEmpresa: i, //posicion del array de la empresa
                  idPadreEmp: puestoDet.Id,
                  subcarpeta: pos, //posicion del array del puesto
                  nombreVac: vacantePue.N.trim(),
                  idVacante: vacantePue.I,
                  idVacantePadre: vacantePue.Id
                });
              }
            } else {
              vacEmpr.push({
                idEmpresa: i, //posicion del array de la empresa
                idPadreEmp: puestoDet.Id,
                subcarpeta: pos, //posicion del array del puesto
                nombreVac: "none"
              });
            }
          }
        }
      } else {
        vacEmpr.push({
          idEmpresa: i,
          idPadreEmp: puestoDet.Id,
          nombreVac: "none"
        });
      }
    }

    this.listVacante = vacEmpr;
    this.listSubcarpetas = puestos;
    this.listEmpresas = empresa;
  }
}
