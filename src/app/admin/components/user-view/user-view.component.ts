import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ApiResponse } from "@apptypes/api-response";
import { Utilities } from "@utils/utilities";
import { TabComponent } from "src/app/components/tabs/tab/tab.component";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { LoggedUser } from "@apptypes/types";
import { COLORS, STATUS } from "src/app/constants/constants";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { applymentStatus } from "@apptypes/enums/applymentStatus.enum";
import { IBusinessAppUser } from "@apptypes/entities/BusinessAppUser";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { BUSINESSTYPES } from "@apptypes/enums/businessTypes.enum";
import { UserAccountService } from "@services/user-account.service";

@Component({
  selector: "app-user-view",
  templateUrl: "./user-view.component.html",
  styleUrls: ["./user-view.component.scss"]
})
export class UserViewComponent implements OnInit {
  public authorized = AUTHORIZED;
  public businessTypes = BUSINESSTYPES;
  public vaStatus = applymentStatus;
  public _error: string = "";

  public _approved: boolean;
  public _comment: string;
  public _loadingComment: boolean;
  public _experienceId: number;

  public _loadingDownload: boolean;
  public _loadingMarkAsViewed: boolean;
  public _loadingIncomeOrder: boolean = false;

  public currentUser: LoggedUser;
  public _businessProfile: boolean = false;
  public _temporality: boolean = false;

  public showJudicialButton: boolean = false;

  public tabs = [
    "Información personal",
    "Información academica",
    "Historial laboral"
  ];
  tabIndex = 0;

  data$: Observable<IBusinessAppUser>;

  util = Utilities;
  isAbleToDownloadReport: boolean = false;

  /*------------------------------------------------------------------------------------------------------------------------
    Controls if the judicial record modal and the validate antecedent button can be exited
  --------------------------------------------------------------------------------------------------------------------------*/
  validateJudicial: boolean = false;
  disabledButtonJudicial: boolean = false;

  constructor(
    private api: Api,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private userAccount: UserAccountService
  ) {}

  ngOnInit() {
    this.currentUser = this.userAccount.getUser();
    this.data$ = this._activatedRoute.data.pipe(
      map(r => r.vacancyApplyment),
      tap((res: IBusinessAppUser) => {
        this.testsDoneByUser(res.vacancyApplyment.id, res.user.id);
        this.markAsViewed(res.vacancyApplyment.vacancy.id, res.user.id);
        this.validateJudicialButton({
          vacancyApplymentStatusId:
            res.vacancyApplyment.vacancyApplymentStatusId,
          userId: res.user.id
        });
      })
    );
  }

  get backTo() {
    const url = JSON.parse(localStorage.getItem("url"));
    return url.prevUrl;
  }

  setTabIndex(tab: TabComponent) {
    this.tabIndex = tab.value;
  }

  public async markAsViewed(vacancyId: number, userId: number) {
    if (this.currentUser.isBusinessProfile || this.currentUser.isAgentProfile)
      return;
    try {
      let body = {
        vacancyId,
        userId
      };
      let response = await this.api
        .post(Entities.markAsViewed, body)
        .toPromise();
      //this.alert.success(response.message);
    } catch (err) {
      this.alert.error(err);
    }
  }

  /** Descargar informe */
  public async downloadReport(data: IBusinessAppUser) {
    this._loadingDownload = true;
    try {
      this.api
        .getData(Entities.downloadReport, {
          vacancyId: data.vacancyApplyment.vacancy.id,
          userId: data.user.id
        })
        .subscribe(file => {
          var url = window.URL.createObjectURL(file);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.href = url;
          a.download = `user_report_${this.currentUser.id}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
          this._loadingDownload = false;
        });
    } catch (err) {
      this.alert.error(err);
      this._loadingDownload = false;
    }
  }

  public async saveReference(data: {
    status: boolean;
    id: number;
    comment: string;
    applyment: IBusinessAppUser;
  }) {
    try {
      let body = {
        laboralExperienceId: data.id,
        approved: data.status,
        comment: data.comment,
        userId: data.applyment.user.id,
        vacancyId: data.applyment.vacancyApplyment.vacancy.id
      };
      let resp = await this.api
        .post(Entities.referencesValidation, body)
        .toPromise();
      //setting new user status to competent.
      data.applyment.vacancyApplyment.vacancyApplymentStatusId = this.vaStatus.COMPETENT;
      this.alert.success(resp.message);
    } catch (err) {
      this.alert.errorAlert(err);
    }
  }

  private getUserUrl() {
    return this.currentUser.isBusinessProfile
      ? Entities.companyUserTestsComplete
      : Entities.userTestsComplete;
  }

  async testsDoneByUser(vacancyAppId: number, userId: number) {
    try {
      const {
        response: { doneByUser, tests }
      } = (await this.api
        .get(`${this.getUserUrl()}/done`, `${vacancyAppId}?userId=${userId}`)
        .toPromise()) as ApiResponse;
      this.isAbleToDownloadReport = doneByUser == tests ? true : false;
    } catch (error) {
      console.log(error);
      this.isAbleToDownloadReport = false;
    }
  }

  gotformOrder() {
    this.router.navigate["../../../form-order"];
    //this.close();
  }

  /**
   * allows you to take the academic document to download
   * @param {any} docCertificate document sent by parameter with json string format
   */
  async downloadCertificate(docCertificate: any) {
    try {
      const { key, nameFile } = Utilities.getInfoS3(docCertificate);
      const s3File: ApiResponse = (await this.api
        .postData(Entities.downloadFile, { key })
        .toPromise()) as ApiResponse;
      Utilities.downloadFiles(s3File.response, nameFile);
    } catch (error) {}
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Open modal validate judicial
  --------------------------------------------------------------------------------------------------------------------------*/
  public showJudicialModal() {
    this.validateJudicial = true;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get the information of the judicial modal child component
  --------------------------------------------------------------------------------------------------------------------------*/
  public onModalJudicial(data: any) {
    this.validateJudicial = data.modal;
    this.disabledButtonJudicial = data.disabledButtonJudicial;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Allows to see the validate antecedent button only if it is an administrator and if it is in state 5
  --------------------------------------------------------------------------------------------------------------------------*/
  public validateJudicialButton({
    vacancyApplymentStatusId,
    userId
  }: {
    vacancyApplymentStatusId: number;
    userId: number;
  }) {
    if (vacancyApplymentStatusId === 5) {
      this.showJudicialButton = true;
    }
    this.api
      .get(
        `${Entities.judicialBackground}/validateJudicialButton`,
        null,
        null,
        null,
        {
          userId
        }
      )
      .subscribe(
        res => (this.showJudicialButton = res.response.show),
        error => {
          this.showJudicialButton = false;
        }
      );
  }

  showReportButtons(vacancyApplyment: IVacancyApplyment) {
    return (
      vacancyApplyment.vacancyApplymentStatusId == this.vaStatus.COMPETENT ||
      this.currentUser.isAdminProfile ||
      this.currentUser.isPsychologistProfile
    );
  }

  goToEntryOrder(vacancyApplyment: IVacancyApplyment) {
    this.router.navigate(["../../../entryOrders/create", vacancyApplyment.id], {
      relativeTo: this._activatedRoute
    });
  }

  /*------------------------------------------------------------------------------------------------------------------------
    Error message
  --------------------------------------------------------------------------------------------------------------------------*/
  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }

  async buyMembershipAlert() {
    let opts = {
      message:
        "Para adquirir al candidato te invitamos a comprar una membresia.",
      bgTop: true,
      bgBottom: false,
      icon: "info-warning"
    };
    const accepted = await this.alert.confirmAlert(opts);

    if (!accepted) return;

    this.router.navigate(["/business/pricing"]);
  }
}
