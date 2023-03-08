import { Component, OnInit, Inject } from "@angular/core";
import { UPLOAD } from "@apptypes/enums/uploadFiles";
import { IFile } from "@apptypes/image";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { finalize } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Component({
  selector: "app-modal-curriculum-vitae",
  templateUrl: "./modal-curriculum-vitae.component.html",
  styleUrls: ["./modal-curriculum-vitae.component.scss"]
})
export class ModalCurriculumVitaeComponent implements OnInit {
  public cv: IFile = { Name: "Examinar" };
  public loading: boolean;

  constructor(
    @Inject(MODAL_DATA) public data: any,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.cv.Data = this.data.cv;
  }

  public onUploadCV() {
    if (this.loading) return;
    Utilities.onUploadFile((data: any) => {
      if (data.error) return this.alert.warningAlert(data.error);
      this.cv = data;
    }, UPLOAD.CURRICULUM);
  }

  public onSave() {
    this.setLoading(true);
    const cv = this.cv.Data;
    const formData = Utilities.jsonToFormData({ cv });
    if (cv) formData.append("cv", cv);
    this.api
      .putData(`${Entities.users}/upload/cv`, formData, "me")
      .pipe(finalize(() => this.setLoading(false)))
      .subscribe(
        res => {
          if (res.response.ok) {
            this.modalRef.modalRef.close({ cv: res.response.cv });
            this.alert.successAlert("Carga de documento exitoso");
          }
        },
        error => this.alert.errorAlert(error)
      );
  }

  private setLoading(loading: boolean) {
    this.loading = loading;
    this.modalRef.modalRef.setLoading(loading);
  }

  public onPreviewDocument(e) {
    if (e.remove) {
      this.api
        .putData(`${Entities.users}/upload/cv`, { removeCv: true }, "me")
        .pipe(finalize(() => this.setLoading(false)))
        .subscribe(
          res => {
            if (res.response.ok) {
              this.modalRef.modalRef.close({ cv: null });
              this.alert.successAlert("Hoja de vida eliminada con éxito");
            }
          },
          error => this.alert.errorAlert(error)
        );
    }
  }
}
