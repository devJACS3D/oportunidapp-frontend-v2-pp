import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Utilities } from '@utils/utilities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS, MESSAGE, STATUS } from 'src/app/constants/constants';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { UPLOAD } from '@apptypes/enums/uploadFiles';
import { IFile } from "@apptypes/image";
@Component({
  selector: 'app-modal-video',
  templateUrl: './modal-video.component.html',
  styleUrls: ['./modal-video.component.scss']
})
export class ModalVideoComponent implements OnInit {
  @Input() info: any;
  @Output() modalQuestion = new EventEmitter<boolean>();
  @Output() modalVideoP = new EventEmitter<boolean>();
  @Output() loadingInfo = new EventEmitter<boolean>();
  public idVideo: string = "videoPreinterview"
  public fileVideo: IFile = {};
  public textUpload: string;
  public loading: boolean = false;

  constructor(
    private alert: DialogService,
    private api: Api,
  ) { }

  ngOnInit() {
    this.textUpload = "Subir video"
  }
  /*----------------------------------------------------
  close modal video
  ----------------------------------------------------*/
  onCloseModalVideoP() {
    this.modalVideoP.emit(false);
  }
  /*----------------------------------------------------
  Upload a video from the archive gallery
  ----------------------------------------------------*/
  public onUploadVideo() {
    const alert = this.alert;
    Utilities.onUploadFile((data: any) => {
      if (!data.error) {
        this.fileVideo = data
        const video = (<HTMLVideoElement>document.getElementById(this.idVideo));
        if (video) {
          video.load()
        }
        this.textUpload = "Subir de nuevo"
      } else {
        alert.customAlert({
          icon: COLORS.WARNING,
          message: data.error,
          closeButton: true,
          closeBackDrop: true,
          bgTop: true,
          bgColor: COLORS.WARNING
        })
      }
    }, UPLOAD.VIDEOS)
  }
  /*----------------------------------------------------
  Save the attached video to the server
  ----------------------------------------------------*/
  public async onSaveVideo() {
    const info = this.info;
    const alert = this.alert;
    if (info) {
      this.loading = true;
      try {
        /* DONE */
        const formData = Utilities.jsonToFormData({ statusId: STATUS.DONE, preinterviewsStatusId: info.id });
        formData.append('file', this.fileVideo.Data);
        await this.api.postData(Entities.userVideopreinterviews, formData).toPromise() as ApiResponse;
        alert.customAlert({
          icon: COLORS.SUCCESS,
          message: `${MESSAGE.PRE_INTERVIEW} enviada correctamente`,
          autoClose: true,
          bgBottom: true,
          bgColor: COLORS.SUCCESS
        })
        /* Emitter father loading data */
        this.loadingInfo.emit(true)
        this.onCloseModalVideoP();
      } catch (error) {
        alert.customAlert({
          icon: COLORS.WARNING,
          message: error,
          autoClose: true,
          bgTop: true,
          bgColor: COLORS.DANGER
        })
      }
      this.loading = false
    }
  }

}
