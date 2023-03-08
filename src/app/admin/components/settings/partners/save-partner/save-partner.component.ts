import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPartner } from '@apptypes/entities/IPartner';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';
import Validator from 'validator';
@Component({
  selector: 'app-save-partner',
  templateUrl: './save-partner.component.html',
  styleUrls: ['./save-partner.component.scss']
})
export class SavePartnerComponent implements OnInit {

  header = 'Crear empresa aliada';
  utils = Utilities;
  file: File;
  previewImage: {
    url: string | ArrayBuffer,
    name: string
  }

  partnerForm: FormGroup;
  submitting$ = new Subject<boolean>();
  validations = Validator;
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MODAL_DATA) private data: IPartner,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private api: Api,
    private alert: DialogService
  ) { }

  ngOnInit() {

    if (this.data.id) {
      this.header = 'Editar empresa aliada'
    }

    if (this.data.images) {
      this.getImageFromJsonArray();
    }

    this.initForm(this.data);
  }


  private getImageFromJsonArray() {
    if (!this.data.images.length) return;
    const url = this.utils.getImgSrc(this.data.images[0]);
    this.previewImage = {
      url,
      name: ''
    }
  }

  initForm(partner: IPartner) {
    this.partnerForm = this.formBuilder.group({
      name: [partner.name, [Validators.required]],
      url: [partner.url, [Validators.required, this.isUrl.bind(this)]],
      description: [partner.description, [Validators.required]],
    });

  }
  private isUrl(formControl: FormControl) {

    if (!formControl.value) return null;
    const isUrlOk = this.validations.isURL(formControl.value);

    if (!isUrlOk) {
      return {
        urlError: true
      }
    }
    return null;
  }


  setImage(event) {
    const file = event.target.files[0];
    const fileName = event.target.value;

    const reader: FileReader = new FileReader();
    if (!file.type.startsWith('image'))
      return;

    this.file = file;
    reader.onload = (e) => {
      const url = reader.result;
      this.previewImage = {
        url,
        name: fileName
      }
    }
    reader.readAsDataURL(file);
  }

  save() {
    this.submitting$.next(true);
    if (!this.data.id) {
      return this.api.postData(Entities.alliances, this.payload)
        .pipe(
          finalize(() => this.submitting$.next(false))
        )
        .subscribe(res => {
          this.successAlert(res.message);
          this.modalRef.modalRef.close(true);
        }, (error) => this.errorAlert(error));
    }

    this.api.putData(Entities.alliances, this.payload, this.data.id)
      .pipe(
        finalize(() => this.submitting$.next(false))
      )
      .subscribe(res => {
        this.successAlert(res.message);
        this.modalRef.modalRef.close(true);
      }, (error) => this.errorAlert(error));

  }

  get payload() {

    const payload = Object.assign({}, this.partnerForm.value);

    const formData = Utilities.getFormData(payload);

    if (this.file) {
      formData.append('images', this.file);
    }
    return formData;
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
    })
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
