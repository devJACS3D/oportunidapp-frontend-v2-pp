import { Component, OnInit } from "@angular/core";
import { IBusiness } from "@apptypes/entities/IBusiness";
import { ACTIONS } from "@apptypes/enums/actions.enum";
import { QUALIFY } from "@apptypes/enums/qualify";
import { Entities } from "@services/entities";
import { UserAccountService } from "@services/user-account.service";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { merge, Observable, pipe, Subject } from "rxjs";
import { filter, finalize, map, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { ModalQualifyComponent } from "src/app/components/modals/modal-qualify/modal-qualify.component";
import { COLORS } from "src/app/constants/constants";

@Component({
  selector: "app-business-profile",
  templateUrl: "./business-profile.component.html",
  styleUrls: ["./business-profile.component.scss"]
})
export class BusinessProfileComponent implements OnInit {
  header: string = "Editar Empresa";
  submitting = new Subject<boolean>();
  business: IBusiness;
  business$: Observable<IBusiness>;
  utils = Utilities;
  public businessFile: File;
  public uploadingFile$ = new Subject<boolean>();
  public buttonCanRate$: Observable<{ qualified: boolean }>;
  public isRatedSubject$ = new Subject<{ qualified: boolean }>();

  constructor(
    private api: Api,
    private alert: DialogService,
    private userAccount: UserAccountService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.business = this.userAccount.getUser<IBusiness>();
    this.business$ = this.userAccount
      .getUser$<IBusiness>()
      .pipe(filter(user => user !== null));
    this.buttonCanRate$ = merge(this.isRatedSubject$, this.showButtonCanRate());
  }

  public setFile(event) {
    let file = event.target.files[0];

    let reader: FileReader = new FileReader();
    if (!file.type.startsWith("image")) {
      return;
    }
    reader.onload = e => {
      const url = reader.result;
      this.businessFile = file;
      this.business.image = JSON.stringify({ location: url });
      this.userAccount.setUser(this.business);
    };
    reader.readAsDataURL(file);
  }
  saveBusiness(data) {
    const { values, type } = data;
    this.submitting.next(true);
    if (type == ACTIONS.EDIT) {
      this.api
        .put(Entities.companies, values, values.id)
        .pipe(finalize(() => this.submitting.next(false)))
        .subscribe(
          res => {
            this.business = Object.assign(this.business, values);
            this.userAccount.setUser(this.business);
            this.successAlert(res.message);
          },
          exception => this.errorAlert(exception)
        );
    }
  }

  saveBusinessImage() {
    const formData = new FormData();
    formData.append("file", this.businessFile);
    this.uploadingFile$.next(true);
    this.api
      .postData(Entities.companyImage, formData)
      .pipe(finalize(() => this.uploadingFile$.next(false)))
      .subscribe(
        res => {
          this.businessFile = null;
          this.business.image = res.response;
          this.userAccount.setUser(this.business);
          this.successAlert(`Se ha guardado la imagen de perfil exitosamente.`);
        },
        error => this.errorAlert(error)
      );
  }

  /*------------------------------------------------------------------------------------------------------------------------
	 Rate the opportuniapp platform
	--------------------------------------------------------------------------------------------------------------------------*/
  companyCanRate() {
    const modal = this.modalService.create(ModalQualifyComponent, {
      data: {
        title: "Calificar Plataforma",
        fullName: "Oportunidapp",
        typeQualify: QUALIFY.PLATFORM
      }
    });
    modal.afterDestroy$.subscribe(res => {
      if (res.qualified) this.isRatedSubject$.next(res);
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
	  Check if there is no previous qualification and if the time limit has been met to be able to show the qualify platform button
	--------------------------------------------------------------------------------------------------------------------------*/
  public showButtonCanRate(): Observable<{ qualified: boolean }> {
    return this.api
      .get(`${Entities.qualifications}/list/canQualify`)
      .pipe(map(res => res.response))
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
