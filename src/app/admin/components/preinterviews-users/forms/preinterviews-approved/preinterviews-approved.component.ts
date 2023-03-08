import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject
} from "@angular/core";
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

@Component({
  selector: "app-preinterviews-approved",
  templateUrl: "./preinterviews-approved.component.html",
  styleUrls: ["./preinterviews-approved.component.scss"]
})
export class PreinterviewsApprovedComponent implements OnInit {
  @Input() info: any;
  @Output() modalVideo = new EventEmitter<boolean>();
  @Output() modalReject = new EventEmitter<boolean>();
  @Output() loadingData = new EventEmitter<boolean>();
  public loading: boolean = false;
  public textApproved: string = `${MESSAGE.TEXT_APPROVED}  ${MESSAGE.PRE_INTERVIEW}`;
  public textRejected: string = `${MESSAGE.TEXT_REJECTED}  ${MESSAGE.PRE_INTERVIEW}`;
  public video: IFile = {};

  constructor(
    private alert: DialogService,
    private api: Api,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.initVideo();
  }
  /*----------------------------------------------------
     Initialize video component
  ----------------------------------------------------*/
  async initVideo() {
    const info = this.info;
    if (info) {
      try {
        const file = info.videopreinterviews[0].video;
        const s3File: IS3Files = (await this.api
          .postData(Entities.getUrl, { file })
          .toPromise()) as any;
        this.video.Location = s3File.path;
      } catch (error) { }
    }
  }
  /*----------------------------------------------------
   Close modal video 
   ----------------------------------------------------*/
  onCloseModalApproved() {
    this.modalVideo.emit(false);
  }

  /*----------------------------------------------------
  Approve a pre interview associated with an agent 
  ----------------------------------------------------*/
  async onApprove() {
    const modal = this.modalService.create(ModalAddCommentsComponent, {});
    const modalRef: any = await modal.getReference();
    modalRef.instance.data.subscribe(async (res: any) => this.approveWithComment(modal, modalRef, res));
  }
  /*------------------------------------------------------------------------------------------------------------------------
    APPROVE PRE INTERVIEW WITH COMMENT
  --------------------------------------------------------------------------------------------------------------------------*/
  async approveWithComment(modal, modalRef ,  res){
    const info = this.info;
    try {
      modalRef.instance.setLoading = true
      modal.setLoading(true)
      const jsonData = { statusId: STATUS.APPROVED, comment: res.comment }
      const id = info.id
      const vacancyApplicationId = this.info.vacancyApplicationId
      await this.api.putData(Entities.preinterviewsUsers, jsonData, id).toPromise() as ApiResponse;
      const body = { vacancyApplymentStatusId: applymentStatus.PSYCHOTECH_TEST };
      await this.api.put(Entities.vacancyApplications, body, vacancyApplicationId).toPromise();
      this.alert.successAlert(`${MESSAGE.PRE_INTERVIEW} aprobada exitosamente`)
      modal.close()
      /* Emitter father loading data */
      this.loadingData.emit(true)
      this.onCloseModalApproved();
    } catch (error) {
      this.alert.errorAlert(error)
    } 
  }



  /*----------------------------------------------------
   Open alert for reject the preinterview 
   ----------------------------------------------------*/
  onReject() {
    const alert = this.alert;
    const self = this;
    alert.customAlert({
      icon: COLORS.WARNING,
      message: `¿Desea rechazar esta ${MESSAGE.PRE_INTERVIEW}?`,
      bgColor: COLORS.WARNING,
      bgTop: true,
      buttons: [
        {
          name: MESSAGE.TEXT_CANCEL,
          class: "primary-border",
          onClick() {
            alert.closeAlert();
          }
        },
        {
          name: MESSAGE.TEXT_REJECTED,
          class: "primary-default",
          onClick() {
            alert.closeAlert();
            self.modalReject.emit(true);
          }
        }
      ]
    });
  }

}
