import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS, MESSAGE, STATUS } from "src/app/constants/constants";
import { Api } from "@utils/api";
import { ApiResponse } from "@apptypes/api-response";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";

@Component({
  selector: "app-preinterviews-rejected",
  templateUrl: "./preinterviews-rejected.component.html",
  styleUrls: ["./preinterviews-rejected.component.scss"]
})
export class PreinterviewsRejectedComponent implements OnInit {
  @Input() info: any;
  @Output() modalReject = new EventEmitter<boolean>();
  @Output() loadingData = new EventEmitter<boolean>();
  public textAddComment: string = MESSAGE.ADD_COMMENT;
  public textSend: string = MESSAGE.TEXT_SEND;
  public loading: boolean = false;
  public FormEntity: FormGroup;

  constructor(private alert: DialogService, private api: Api) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    /* Form group data */
    this.FormEntity = new FormGroup({
      comment: new FormControl("", [Validators.required]),
      statusId: new FormControl(STATUS.REJECTED, [])
    });
  }
  /*----------------------------------------------------
  Save and update data form pre interview 
  ----------------------------------------------------*/
  public async onSendReject() {
    const alert = this.alert;
    const info = this.info;
    if (info) {
      const entityForm: any = this.FormEntity;
      if (entityForm.valid) {
        this.loading = true;
        try {
          const id = info.id;
          const body = { referenceId: id, reason: entityForm.value.comment };
          (await this.api
            .post(Entities.rejectedPreInterviews, body)
            .toPromise()) as ApiResponse;
          alert.customAlert({
            icon: COLORS.SUCCESS,
            message: `${MESSAGE.PRE_INTERVIEW} rechazada con éxito`,
            autoClose: true,
            bgBottom: true,
            bgColor: COLORS.SUCCESS
          });
          /* Emitter father loading data */
          this.loadingData.emit(true);
        } catch (error) {
          alert.customAlert({
            icon: COLORS.WARNING,
            message: error,
            autoClose: true,
            bgTop: true,
            bgColor: COLORS.DANGER
          });
        }
        this.loading = false;
        this.onCloseModalReject();
      } else {
        Utilities.markAsDirty(this.FormEntity);
      }
    }
  }
  /*----------------------------------------------------
  Close modal rejected
  ----------------------------------------------------*/
  onCloseModalReject() {
    this.modalReject.emit(false);
  }
}
