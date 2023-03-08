import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS, MESSAGE, STATUS } from "src/app/constants/constants";
import { ApiResponse } from "@apptypes/api-response";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { IFile } from "@apptypes/image";
import { applymentStatus } from "@apptypes/enums/applymentStatus.enum";
import { IS3Files } from "@apptypes/entities/s3Files";
import { ModalService } from "src/app/components/modal/modal.service";
import { ModalAddCommentsComponent } from "src/app/components/modals/modal-add-comments/modal-add-comments.component";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-preinterviews-video",
  templateUrl: "./preinterviews-video.component.html",
  styleUrls: ["./preinterviews-video.component.scss"]
})
export class PreinterviewsVideoComponent implements OnInit {
  @Input() preinterview: any;
  @Output() modalVideo = new EventEmitter<boolean>();
  public textApproved: string = `${MESSAGE.TEXT_APPROVED}  ${MESSAGE.PRE_INTERVIEW}`;
  public textRejected: string = `${MESSAGE.TEXT_REJECTED}  ${MESSAGE.PRE_INTERVIEW}`;
  public video: IFile = {};

  constructor(
    private alert: DialogService,
    private api: Api,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.initVideo();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Initialize video component
  --------------------------------------------------------------------------------------------------------------------------*/
  initVideo() {
    const file = this.preinterview.videopreinterviews[0].video;
    this.api
      .postData(Entities.getUrl, {
        file
      })
      .subscribe((s3File: any) => (this.video.Location = s3File.path));
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Open modal approve
  --------------------------------------------------------------------------------------------------------------------------*/
  async openModalApprove() {
    const { modal, modalRef } = await this.instanceModalAddComments();
    modalRef.instance.data.subscribe(async (res: any) =>
      this.approveWithComment(modal, modalRef, res)
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    APPROVE PRE INTERVIEW WITH COMMENT
  --------------------------------------------------------------------------------------------------------------------------*/
  async approveWithComment(modal: any, modalRef: any, res: any) {
    const preinterview = this.preinterview;
    try {
      this.setLoading(modal, modalRef, true);
      const jsonData = { statusId: STATUS.APPROVED, comment: res.comment };
      const id = preinterview.id;
      const vacancyApplicationId = preinterview.vacancyApplicationId;
      const body = {
        vacancyApplymentStatusId: applymentStatus.PSYCHOTECH_TEST
      };
      await this.api.put(Entities.preinterviewsUsers, jsonData, id).toPromise();
      await this.api
        .put(Entities.vacancyApplications, body, vacancyApplicationId)
        .toPromise();
      modal.close();
      this.onModalVideo({ close: true, refreshData: true });
      this.alert.successAlert(`${MESSAGE.PRE_INTERVIEW} aprobada exitosamente`);
    } catch (error) {
      this.alert.errorAlert(error);
    } finally {
      this.setLoading(modal, modalRef, false);
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Open modal reject
  --------------------------------------------------------------------------------------------------------------------------*/
  async openModalReject() {
    this.alert.customAlert({
      icon: COLORS.WARNING,
      message: `¿Desea rechazar esta ${MESSAGE.PRE_INTERVIEW}?`,
      bgColor: COLORS.WARNING,
      bgTop: true,
      buttons: [
        {
          name: MESSAGE.TEXT_CANCEL,
          class: "primary-border",
          onClick: () => {
            this.alert.closeAlert();
          }
        },
        {
          name: MESSAGE.TEXT_REJECTED,
          class: "primary-default",
          onClick: async () => {
            this.alert.closeAlert();
            const { modal, modalRef } = await this.instanceModalAddComments();
            modalRef.instance.data.subscribe(async (res: any) =>
              this.rejectWithComment(modal, modalRef, res)
            );
          }
        }
      ]
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    REJECTED PRE INTERVIEW WITH COMMENT
  --------------------------------------------------------------------------------------------------------------------------*/
  async rejectWithComment(modal: any, modalRef: any, res: any) {
    const preinterview = this.preinterview;
    try {
      this.setLoading(modal, modalRef, true);
      const id = preinterview.id;
      const jsonData = { statusId: STATUS.REJECTED, comment: res.comment };
      const body = { referenceId: id, reason: res.comment };
      await this.api.post(Entities.rejectedPreInterviews, body).toPromise();
      await this.api.put(Entities.preinterviewsUsers, jsonData, id).toPromise();
      modal.close();
      this.onModalVideo({ close: true, refreshData: true });
      this.alert.successAlert(`${MESSAGE.PRE_INTERVIEW} rechazada con éxito`);
    } catch (error) {
      this.alert.errorAlert(error);
    } finally {
      this.setLoading(modal, modalRef, false);
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Instance modal add comments
  --------------------------------------------------------------------------------------------------------------------------*/
  async instanceModalAddComments() {
    const modal = this.modalService.create(ModalAddCommentsComponent, {});
    const modalRef: any = await modal.getReference();
    return { modal, modalRef };
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Loading data
  --------------------------------------------------------------------------------------------------------------------------*/
  setLoading(modal, modalRef, loading) {
    modalRef.instance.setLoading = loading;
    modal.setLoading(loading);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Close modal pre interviews video
  --------------------------------------------------------------------------------------------------------------------------*/
  onModalVideo({ close = false, refreshData = false }) {
    const data: any = { close, refreshData };
    this.modalVideo.emit(data);
  }
}
