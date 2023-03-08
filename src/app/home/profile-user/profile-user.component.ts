import { Component, OnDestroy, OnInit } from "@angular/core";
import { Api } from "@utils/api";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { Observable, Subject, Subscription } from "rxjs";
import { UserAccountService } from "@services/user-account.service";
import { image, IFile } from "@apptypes/image";
import { Utilities } from "@utils/utilities";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { finalize } from "rxjs/operators";
import { AUTHORIZED } from "@apptypes/enums/authorized.enum";
import { ModalService } from "src/app/components/modal/modal.service";
import { ModalCurriculumVitaeComponent } from "src/app/components/modals/modal-curriculum-vitae/modal-curriculum-vitae.component";
import { ModalChangePasswordComponent } from "src/app/components/modals/modal-change-password/modal-change-password.component";
import { Router } from "@angular/router";
import { COLORS } from "src/app/constants/constants";

@Component({
  selector: "app-profile-user",
  templateUrl: "./profile-user.component.html",
  styleUrls: ["./profile-user.component.scss"]
})
export class ProfileUserComponent implements OnInit, OnDestroy {
  auths = AUTHORIZED;

  public _loadingInit: boolean;

  public _rate: number = 3.4;
  public _user: any;

  public _error: string = "";

  public _cvFile: IFile = {};
  public _loadingFile: boolean = false;

  public _userImage: image = {};
  public _loadingImg: boolean = false;

  public updatingAvailability$ = new Subject<boolean>();
  public loadingCertificate: boolean = false;

  constructor(
    private api: Api,
    private userAccount: UserAccountService,
    private alert: DialogService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit() {
    this._loadingInit = true;

    this._userImage.Url = "assets/empty.jpg";
    this._cvFile.Location = null;

    try {
      await this.loadUser();
    } catch (err) {
      this._error = err;
    }

    this._loadingInit = false;
  }

  public loadUser() {
    return new Promise(async (resolve, reject) => {
      try {
        let respUser = (await this.api
          .get(Entities.userRegister, " ")
          .toPromise()) as ApiResponse;
        this._user = respUser.response;
        // console.log("DATOS DEL USUARIO", this._user);

        if (this._user.credentialUser.cv) {
          let cvObj = JSON.parse(this._user.credentialUser.cv);
          this._cvFile.Location = cvObj.Location;
        }

        if (this._user.credentialUser.image) {
          let imageObj = JSON.parse(this._user.credentialUser.image);
          this._userImage.Url = imageObj.Location;
        }

        resolve("ok");
      } catch (err) {
        reject(err);
      }
    });
  }

  public async saveImg() {
    if (this._userImage.Data) {
      this._loadingImg = true;
      try {
        const body = { filename: this._userImage.Name };
        let formData = Utilities.getFormData(body);
        formData.append("file", this._userImage.Data);

        const response = await this.api
          .postData(Entities.userImage, formData)
          .toPromise();
        this._userImage.Name = null;
        this._userImage.Data = null;

        await this.loadUser();
        this.userAccount.setUser({
          ...this.userAccount.getUser(),
          image: this._user.credentialUser.image
        });

        this.alert.success("Se cargo con éxito la foto de perfil.");
      } catch (err) {
        alert(err);
      }
      this._loadingImg = false;
    }
  }

  public onInputFileChange(event) {
    let file = event.target.files[0];
    let fileName = event.target.value;

    let reader: FileReader = new FileReader();
    // console.log('file type: ', file.type);
    reader.onload = async e => {
      let url = reader.result;
      this._cvFile = {
        Location: url,
        Name: fileName,
        Data: file
      };

      this._loadingFile = true;

      try {
        const body = { filename: this._cvFile.Name };
        let formData = Utilities.getFormData(body);
        formData.append("file", this._cvFile.Data);

        const response = await this.api
          .postData(Entities.userCurriculum, formData)
          .toPromise();
        await this.loadUser();

        this._cvFile.Name = null;
        this._cvFile.Data = null;
        this.alert.success(response.message);
      } catch (err) {
        this.alert.errorAlert(err);
      }

      this._loadingFile = false;
    };
    reader.readAsDataURL(file);
  }

  public onInputImageChange(event) {
    let file = event.target.files[0];
    let fileName = event.target.value;

    let reader: FileReader = new FileReader();
    if (file.type.startsWith("image")) {
      reader.onload = e => {
        let url = reader.result;
        this._userImage = {
          Url: url,
          Name: fileName,
          Data: file
        };
      };
      reader.readAsDataURL(file);
    } else {
      alert("¡Sólo se admiten imágenes!");
    }
  }

  private formaDate(date: string) {
    return Utilities.formaDateToJSON(date, true);
  }

  public setAvailability(event: Event) {
    const available = event.target["checked"];

    this.updatingAvailability$.next(true);
    this.api
      .put(`${Entities.users}/status`, { available }, "me")
      .pipe(finalize(() => this.updatingAvailability$.next(false)))
      .subscribe(
        res => {
          this._user.credentialUser.available = available;
        },
        error => {
          event.target["checked"] = !available;
          this.alert.errorAlert(error);
        }
      );
  }

  /*------------------------------------------------------------------------------------------------------------------------
    Download Certificate
  --------------------------------------------------------------------------------------------------------------------------*/
  downloadCertificate() {
    this.loadingCertificate = true;
    this.api
      .get(`${Entities.users}/report/certificate`, null, null, null, null)
      .pipe(finalize(() => (this.loadingCertificate = false)))
      .subscribe(
        (res: any) =>
          Utilities.downloadFromBase64(res.response, "certificado.pdf"),
        error => this.alert.errorAlert(error)
      );
  }
  /*------------------------------------------------------------------------------------------------------------------------
	  See curriculum vitae user
	--------------------------------------------------------------------------------------------------------------------------*/
  public curriculumVitae() {
    const modal = this.modalService.create(ModalCurriculumVitaeComponent, {
      data: { cv: this._user.credentialUser.cv }
    });
    modal.afterDestroy$.subscribe(
      res => (this._user.credentialUser.cv = res.cv)
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Change password
  --------------------------------------------------------------------------------------------------------------------------*/
  public async changePassword() {
    const modal = this.modalService.create(ModalChangePasswordComponent, {});
    const modalRef: any = await modal.getReference();
    modalRef.instance.data.subscribe(async (res: any) => {
      this.setLoading(modal, modalRef, true);
      this.api
        .post(`${Entities.users}/changePassword`, { ...res })
        .pipe(finalize(() => this.setLoading(modal, modalRef, false)))
        .subscribe(
          res => {
            if (res.response.ok) {
              modal.close();
              this.alert.customAlert({
                icon: "success_white",
                bgColor: COLORS.SUCCESS,
                bgTop: true,
                message:
                  "Se ha cambiado la contraseña exitosamente, por favor vuelve a iniciar sesión",
                buttons: [
                  {
                    name: "Ok",
                    class: "primary-default",
                    onClick: async () => {
                      this.alert.closeAlert();
                      this.logOut();
                    }
                  }
                ]
              });
            }
          },
          error => this.alert.errorAlert(error)
        );
    });
  }

  /*------------------------------------------------------------------------------------------------------------------------
    Loading data
  --------------------------------------------------------------------------------------------------------------------------*/
  setLoading(modal, modalRef, loading) {
    modalRef.instance.setLoading = loading;
    modal.setLoading(loading);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Logout after change password
  --------------------------------------------------------------------------------------------------------------------------*/
  public logOut() {
    this.api.post(Entities.signout, {}).subscribe(res => {
      if (!res) return;
      this.api.signOut();
      this.router.navigate(["/"]);
      this.userAccount.setUser(null);
    });
  }
}
