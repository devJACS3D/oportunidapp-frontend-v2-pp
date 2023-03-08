import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { IVacancy } from "@apptypes/entities/vacancy";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { Observable, Subscription } from "rxjs";
import { UserAccountService } from "@services/user-account.service";
import { DialogService } from "../dialog-alert/dialog.service";
import { image } from "@apptypes/image";
import { Vacancy } from "@apptypes/classes/vacancy.class";
import { COLORS } from "src/app/constants/constants";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-detail-vacancies",
  templateUrl: "./detail-vacancies.component.html",
  styleUrls: ["./detail-vacancies.component.scss"]
})
export class DetailVacanciesComponent implements OnInit, OnDestroy {
  AUTHORIZED = AUTHORIZED;
  private subscriberOkButton: Subscription;
  public _loading: boolean;

  isVac: boolean;
  clssContainerBussines: boolean;

  public _loadingForm: boolean;

  public _vacancyImage: image = {};
  private _idEntity: number;
  private _idVacante: number;
  public _Entity: IVacancy;

  public isOut: boolean;

  public _currentUser: Observable<any>;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userAccount: UserAccountService,
    private api: Api,
    private alert: DialogService
  ) {
    this.applyRoute();
  }

  async ngOnInit() {
    this._loading = false;

    this.isOut = this.router.url.toString().includes("home/");

    this._loadingForm = true;

    this._idVacante = this.activatedRoute.snapshot.params.vac;

    try {
      this._idEntity = this.activatedRoute.snapshot.params.id;
      this._vacancyImage.Url = "assets/empty.jpg";

      let resp: ApiResponse = await this.api
        .get(Entities.vacancies, this._idEntity)
        .toPromise();
      console.log(resp.response);
      this._Entity = resp.response;

      if (this._Entity.images) {
        let imageObj = JSON.parse(this._Entity.images[0]);
        this._vacancyImage.Url = imageObj.Location;
      }
    } catch (err) {
      alert(err);
    }

    this._currentUser = this.userAccount.getUser$();
    this._loadingForm = false;

    this.verifyJudicialBackground();
  }

  verifyJudicialBackground() {
    this._currentUser.subscribe(user => {
      //is agent
      if (user && user.userTypeId === 4) {
        this.api
          .post(`${Entities.judicialBackground}/verifyIfIsRejected`, {})
          .subscribe(
            res => {},
            error => {}
          );
      }
    });
  }

  public async apply() {
    const text =
      "Para completar el proceso, diríjase a la sección pre-entrevistas en su perfil y siga las instrucciones para continuar con su aplicación";
    try {
      console.log(this._idEntity);

      let resp = (await this.api
        .post(Entities.userVacancies, { vacancyId: this._idEntity })
        .toPromise()) as ApiResponse;
      // if (resp.code === 1) {
      //   const destinatario: string = "desarrollo@jacs3d.com";
      //   const remitente: string = "desarrollo@jacs3d.com";
      //   const asunto: string = "solicitud aplicar vacante";
      //   const contenido: string = "codigo enlace aplicar";

      //   this.mail.enviarCorreo(destinatario, remitente, asunto, contenido);
      // }
      console.log("apply Response: ", resp);

      this.alert.test("Aplicación exitosa !", text);
      this.subscriberOkButton = this.alert.onOkButton().subscribe(() => {
        this.router.navigate(["home/profile/user-interview/preinterviews"]);
      });
    } catch (err) {
      console.log(err);

      this.alert.error(err);
    }

    this._loading = false;
  }

  ngOnDestroy() {
    if (this.subscriberOkButton) this.subscriberOkButton.unsubscribe();
  }

  public goBack() {
    if (this.isOut) this.location.back();
    else if (this.router.url.toString().includes("vacantes/")) {
      this.router.navigate(["business/vacantes"]);
    } else {
      if (this.router.url.toString().includes("admin/")) {
        this.router.navigate(["admin/"]);
      } else {
        this.router.navigate(["business/"]);
      }
    }
  }

  public goToCompetendsOrStands(
    status: number,
    vaid: number,
    to: "competents" | "stands",
    idVac: number
  ) {
    this.router.navigate(
      [
        `../../../../candidates/va/${status}/${vaid}/${
          to == "competents" ? "Aptos" : "Postulados"
        }/${idVac}`
      ],
      {
        relativeTo: this.activatedRoute
      }
    );
  }

  applyRoute() {
    if (this.router.url.toString().includes("vacantes/")) {
      this.isVac = false;
    } else {
      this.isVac = true;
    }

    if (this.router.url.toString().includes("business/")) {
      this.clssContainerBussines = true;
    }
  }

  /* ................................................................................................. */
  /* PUBLISH REQUISITION/VACANCY */
  /* ................................................................................................. */
  async publishRequisition() {
    try {
      await this.api
        .put(`${Entities.vacancies}/publish`, {}, this._Entity.id)
        .toPromise();
      this.successAlert(
        `La vacante de la empresa ${this._Entity.company.name} fue publicada correctamente.`
      );
      this.router.navigate(["../../../vacancies"], {
        relativeTo: this.activatedRoute
      });
    } catch (error) {
      this.errorAlert(error);
    }
  }

  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }
}
