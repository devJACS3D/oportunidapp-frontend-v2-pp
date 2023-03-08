import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Entities } from '@services/entities';
import { IS3Files } from '@apptypes/entities/s3Files';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'preview-document',
  templateUrl: './preview-document.component.html',
  styleUrls: ['./preview-document.component.scss']
})
export class PreviewDocumentComponent implements OnInit {

  public showContent: boolean = true
  public loadingFile: boolean;
  @Input() title: string;
  @Input() file: any;
  @Input() loadingColor: string
  @Output() onPreviewDocument: EventEmitter<any> = new EventEmitter();
  constructor(
    private api: Api,
    private alert: DialogService,
  ) { }

  ngOnInit() {
  }

  public async downloadFile() {
    if (this.file && !this.loadingFile) {
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
