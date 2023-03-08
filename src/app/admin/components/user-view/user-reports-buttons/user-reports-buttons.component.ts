import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from "@apptypes/entities/IUser";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { applymentStatus } from "@apptypes/enums/applymentStatus.enum";
import { NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Component({
  selector: "app-user-reports-buttons",
  templateUrl: "./user-reports-buttons.component.html",
  styleUrls: ["./user-reports-buttons.component.scss"]
})
export class UserReportsButtonsComponent implements OnInit {
  @Input() vacancyApplyment: IVacancyApplyment;
  @Input() user: IUser;
  status = applymentStatus;

  showInfoPotencial: boolean = false;
  public loadingDesRep: boolean;

  idVacante: number;
  idCandidato: number;

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private _apiEval: ApiEvaluatest,
    private config: NgbDropdownConfig
  ) {}

  ngOnInit() {
    this.idVacante = this._activatedRoute.snapshot.params.vac;
    this.idCandidato = this._activatedRoute.snapshot.params.id;
    this.config.autoClose = false;
  }

  get vaStatus() {
    return this.vacancyApplyment.vacancyApplymentStatusId;
  }

  get hasPermission() {
    return this.vacancyApplyment.ableToDownloadFiles;
  }

  get reportAvailability() {
    return this.vacancyApplyment.ableToDownloadFiles;
  }

  printPersonalityTest() {
    this.router.navigate([`print/personalityTest/${this.user.id}`], {
      queryParams: {
        scale: "general",
        serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
      }
    });
  }

  printTest() {
    const q = JSON.stringify({
      vacancyId: this.vacancyApplyment.vacancy.id,
      userId: this.user.id,
      serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
    });
    this.router.navigate([`print/psychotechnicalTest`], {
      queryParams: {
        q: q
      }
    });
  }

  printInterview() {
    this.router.navigate([`print/interview`], {
      queryParams: {
        userId: this.user.id,
        vacancyId: this.vacancyApplyment.vacancy.id,
        serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
      }
    });
  }

  printWorkReferences() {
    this.router.navigate([`print/workReferences`], {
      queryParams: {
        userId: this.user.id,
        vacancyId: this.vacancyApplyment.vacancy.id,
        serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
      }
    });
  }

  printPreInterviews() {
    this.router.navigate([`print/preInterviews`], {
      queryParams: {
        userId: this.user.id,
        vacancyId: this.vacancyApplyment.vacancy.id,
        serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
      }
    });
  }

  printJudicialBackground() {
    this.router.navigate([`print/judicialBackground`], {
      queryParams: {
        userId: this.user.id,
        serviceTypeId: this.vacancyApplyment.vacancy.serviceTypeId
      }
    });
  }

  // ocultar/mostar menu de opciones de descarga Diag de potencial
  public infoMetodoDescPot() {
    this.showInfoPotencial = !this.showInfoPotencial;
  }

  /*-------------------------------------
  DESCARGAS DE REPORTES 
  --------------------------------------*/
  // descargar reporte de afinidad
  public downloadRepAfinidad() {
    this.loadingDesRep = true;
    let pathUrl = `affinity/v1/jobprofile/${this.idVacante}/candidate/${this.idCandidato}/language/es`;

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
  public downloadRepDiagPotencialClas() {
    this.loadingDesRep = true;
    let pathUrl = `potential/v1/candidateId/${this.idCandidato}/vacant/${this.idVacante}`;

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
  public downloadAutBiomFacial() {
    this.loadingDesRep = true;
    let pathUrl = `report/${this.idVacante}/jobProfile/${this.idCandidato}/candidate/incident`;

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
  public downloadDiagPotencial() {
    this.loadingDesRep = true;
    let itemaDiag: any = document.querySelectorAll(
      '#incluirPDF input[type="checkbox"]'
    );

    let grafica = itemaDiag[0].checked;
    let tblResu = itemaDiag[1].checked;
    let interpret = itemaDiag[2].checked;

    let pathUrl = `VacantCandidates/candidate/${this.idCandidato}/vacant/${this.idVacante}/graphics/${grafica}/tables/${tblResu}/interpretations/${interpret}/variables/pdf`;

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
