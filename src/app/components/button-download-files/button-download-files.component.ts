import { Component, OnInit, Input } from '@angular/core';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Entities } from '@services/entities';
import { IS3Files } from '@apptypes/entities/s3Files';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';
import { DOWNLOAD_TYPE } from '@apptypes/enums/downloadFiles';
@Component({
  selector: 'button-download-files',
  templateUrl: './button-download-files.component.html',
  styleUrls: ['./button-download-files.component.scss']
})
export class ButtonDownloadFilesComponent implements OnInit {

  @Input() file: any;
  @Input() loadingColor: string
  @Input() type: any = DOWNLOAD_TYPE.NORMAL
  @Input() title: string
  public downloadType = DOWNLOAD_TYPE
  public loadingFile: boolean;
  constructor(
    private api: Api,
    private alert: DialogService,
  ) { }

  ngOnInit() {

  }

  public async downloadFile() {
    if (this.file) {
      try {
        this.loadingFile = true;
        const file = this.file
        const s3File: IS3Files = await this.api.postData(Entities.downloadFile, { file }).toPromise() as any;
        Utilities.downloadFromBase64(s3File.path, s3File.name)
      } catch (error) {
        this.errorAlert(error)
      }
      this.loadingFile = false;
    }
  }

  public downloadIcon(file: boolean): string {
    const icon = file ? 'download-icon-filled.png' : 'download-disabled.png'
    return Utilities.assets(icon);
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    })
  }
}
