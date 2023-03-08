import { Component, OnInit } from "@angular/core";
import { IPagination } from "@apptypes/pagination";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { AppSettings } from "@services/settings";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";
import { ApiResponse } from "@apptypes/api-response";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ApiEvaluatest } from "@utils/api-evaluatest";

@Component({
  selector: "app-user-vacancies",
  templateUrl: "./user-vacancies.component.html",
  styleUrls: ["./user-vacancies.component.scss"]
})
export class UserVacanciesComponent implements OnInit {
  public _loadingInit: boolean;
  public _loadingPage: boolean;
  public _error: string = "";

  public _showConfirm: boolean;
  public _loadingConfirm: boolean;
  public _confirmMessage: string;

  public _EntityToDelete: any;

  public _result: any;
  public _currentPage: number;
  public _ItemsPerPage: number;
  public _pagination: IPagination;

  interviews: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private api: Api,
    private apiEval: ApiEvaluatest,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this._loadingInit = true;
    this._showConfirm = false;
    this._loadingInit = true;
    this._loadingPage = true;

    this._currentPage = this.activatedRoute.snapshot.params.page;
    this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

    if (!this._currentPage || !this._ItemsPerPage) {
      if (!this._currentPage)
        this.router.navigate([`./1/${AppSettings.defaultItemsPerPage}`], {
          relativeTo: this.activatedRoute
        });
      else
        this.router.navigate([`../1/${AppSettings.defaultItemsPerPage}`], {
          relativeTo: this.activatedRoute
        });
    } else {
      this.loadEntidades();
    }

    this.getInterview();
  }

  private async loadEntidades() {
    try {
      let resp = (await this.api
        .get(
          Entities.userVacancies,
          null,
          this._currentPage,
          this._ItemsPerPage
        )
        .toPromise()) as ApiResponse;
      console.log("response: ", resp);
      const respLog = await this.apiEval.login();
      const id = sessionStorage.getItem("idUser");
      const path = `process/candidate/v1/${id}/historical`;
      const rankCan = await this.apiEval.getProcess(path).toPromise();
      console.log(rankCan);

      this._result = resp.response;

      await this._result.data.forEach(data => {
        rankCan.forEach(async cand => {
          if (data.vacancy.name.trim() == cand.name.trim()) {
            const pathEval = `evaluationcode/v1/job/${cand.jobProfileId}`;
            const evalua = await this.apiEval
              .getEvaluacion(pathEval)
              .toPromise();

            data.vacancy.idEvalVac = cand.jobProfileId;
            data.vacancy.code = evalua[0].Code;
          }
        });
      });

      console.log(this._result);

      this._pagination = {
        pages: Utilities.recordPages(this._result.pagesNumber),
        pagesNumber: this._result.pagesNumber,
        elementsNumber: this._result.elementsNumber,
        itemsPerPage: this._ItemsPerPage,
        currentPage: this._currentPage
      };

      if (!this._result.data.length && this._result.elementsNumber > 0) {
        if (this._currentPage != this._result.pagesNumber)
          this.goToPage({ pageNumber: this._result.pagesNumber });
        else {
          this._loadingInit = false;
          this._loadingPage = false;
        }
      } else {
        this._loadingInit = false;
        this._loadingPage = false;
      }
    } catch (err) {
      if (this._loadingInit) this._error = err;

      alert(err);

      this._loadingInit = false;
      this._loadingPage = false;
    }
  }

  public goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    this._loadingPage = true;
    this._currentPage = event.pageNumber;
    this.loadEntidades();
    this.router.navigate(
      ["./../../" + event.pageNumber + "/" + this._ItemsPerPage],
      { relativeTo: this.activatedRoute }
    );
  }

  public closeConfirm($event) {
    if ($event) {
      this._showConfirm = false;
    }
  }

  public delete(Entity: any) {
    this._confirmMessage =
      "¿Desea eliminar el proceso para la vacante " + Entity.vacancy.name + "?";
    this._showConfirm = true;
    this._EntityToDelete = Entity;
  }

  public async confirm($event: Event) {
    if ($event) {
      this._loadingConfirm = true;

      try {
        let resp = (await this.api
          .delete(Entities.userVacancies, this._EntityToDelete.id)
          .toPromise()) as ApiResponse;

        this.alert.success(resp.message);
        this.loadEntidades();
      } catch (err) {
        alert(err);
      }

      this._loadingConfirm = false;
      this._showConfirm = false;
    }
  }

  async getInterview() {
    let citiesResp = await this.api
      .get("user/interviews", null, 1, 1000)
      .toPromise();
    this.interviews = citiesResp.response;
    console.log("getInterview", this.interviews);
  }
}
