import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from "@utils/api";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { IEducationalLevel } from "@apptypes/entities/educational-level";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Subject } from 'rxjs';
import { COLORS, MESSAGE } from 'src/app/constants/constants';
import { IFile } from "@apptypes/image";
import { UPLOAD } from "@apptypes/enums/uploadFiles";

@Component({
  selector: "app-form-studies",
  templateUrl: "./form-studies.component.html",
  styleUrls: ["./form-studies.component.scss"],
})
export class FormStudiesComponent implements OnInit {
  public _title: string;
  public submitting$ = new Subject();
  public studiesForm: FormGroup;
  public _educationalLevels: IEducationalLevel[] = [];
  public _daysFinish = Utilities.onDays();
  public _monthsFinish = Utilities.onMonths();
  public _yearsFinish = Utilities.onYears();
  public _today = Utilities.formatDate(moment().unix());
  public academicFile: IFile = { Name: 'Adjuntar documento' };
  public loadingData: boolean = false;
  public utils = Utilities

  constructor(
    @Inject(MODAL_DATA) private data: any,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private api: Api,
    private alert: DialogService,
    private formBuilder: FormBuilder
  ) { }
  /*------------------------------------------------------------------------------------------------------------------------
    Initialize form component
  --------------------------------------------------------------------------------------------------------------------------*/
  async ngOnInit() {
    // console.log("DATA MODAL", this.data);
    this._title = this.data.id ? MESSAGE.TEXT_UPDATE : MESSAGE.TEXT_CREATE
    this.initForm(this.data);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get all the values ​​that come from the form group
  --------------------------------------------------------------------------------------------------------------------------*/
  get payload() {
    const payload = {
      ...this.studiesForm.value,
    }
    return payload;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async initForm(initValues?: any) {
    const finishDate = Utilities.onSplitDate(initValues.finishedDate)
    const startDateCertificate = Utilities.onSplitDate(initValues.startDateCertificate)
    const finishDateCertificate = Utilities.onSplitDate(initValues.finishDateCertificate)
    this.studiesForm = this.formBuilder.group({
      studiesLevelId: [initValues.studiesLevelId, [Validators.required]],
      institution: [initValues.institution, [Validators.required]],
      title: [initValues.title, [Validators.required]],
      daysFinish: [finishDate.day, [Validators.required]],
      monthsFinish: [finishDate.month, [Validators.required]],
      yearsFinish: [finishDate.year, [Validators.required]],
      isSinCertificate: [initValues.isSinCertificate, [Validators.required]],
      isInTramite: [initValues.isInTramite, [Validators.required]],
      isInProcess: [initValues.isInProcess, [Validators.required]],
      startDateCertificate: [startDateCertificate, [Validators.required]],
      finishDateCertificate: [finishDateCertificate, [Validators.required]],
      cea: [initValues.cea, []]
    });

    this.onEducationalLevels()
    this.checkDocument(this.payload.isInProcess)
    this.checkCertificate(this.payload.cea ? false : this.payload.isSinCertificate, 'isInTramite')
    this.checkCertificate(this.payload.cea ? false : this.payload.isInTramite, 'isSinCertificate')

    if (this.payload.isSinCertificate || this.payload.isInTramite) {
      this.checkisInProcess(true)
    }

  }
  /*------------------------------------------------------------------------------------------------------------------------
   Get all educational levels
 --------------------------------------------------------------------------------------------------------------------------*/
  public async onEducationalLevels() {
    const eLevelResp = await this.api
      .get(Entities.educationalLevels, null, 1, 1000)
      .toPromise();
    this._educationalLevels = eLevelResp.response.data;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Validate if you have a document in process or you do not have a certificate
  --------------------------------------------------------------------------------------------------------------------------*/
  public checkCertificate(active: boolean, type: string) {
    this.disabledControl(type, active);
    const listItem = ['startDateCertificate', 'finishDateCertificate', 'isInProcess'];
    listItem.map(control => this.disabledControl(control, active))
    if (!this.payload.isInProcess) {
      listItem.pop()
      listItem.map(control => this.disabledControl(control, true))
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Validate if you have a document in process or you do not have a certificate
  --------------------------------------------------------------------------------------------------------------------------*/
  public checkisInProcess(active: boolean) {
    this.disabledControl('isInProcess', active);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Validate if the attached document is valid
  --------------------------------------------------------------------------------------------------------------------------*/
  public checkDocument(active: boolean) {
    const listItem = ['startDateCertificate', 'finishDateCertificate'];
    listItem.map(control => this.disabledControl(control, !active))
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  public itemDisabled() {
    return this.payload.isSinCertificate || this.payload.isInTramite
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  public onUploadCertificate() {
    Utilities.onUploadFile((data: any) => {
      if (data.error) return this.warningAlert(data.error)
      this.academicFile = data
    }, UPLOAD.PDF)
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Receive preview document data
  --------------------------------------------------------------------------------------------------------------------------*/
  public async onPreviewDocument(data: any) {
    if (data.remove) {
      this.deleteCertificate(this.data)
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async deleteCertificate(study: any) {
    const ref = this;
    this.alert.customAlert({
      title: `¿Desea eliminar el certificado seleccionado?`,
      bgColor: COLORS.DANGER,
      bgBottom: true,
      closeButton: true,
      buttons: [
        {
          name: 'Eliminar',
          onClick: function () {
            ref.alert.loadingAlert(this, true);
            ref.delete(study, this)
          }
        }
      ]
    })
  }
  private delete(study: any, refModal) {
    this.api.put(Entities.userStudies, {
      cea: null,
      isInTramite: false,
      isSinCertificate: false
    }, study.id).subscribe(async res => {
      this.alert.closeAlert();
      this.studiesForm.controls.cea.setValue(null)
      this.modalRef.modalRef.refresh({ study });
      this.academicFile = { Data: null, Name: 'Adjuntar documento' }
      this.successAlert('Certificado Eliminado');
    }, (error) => this.errorAlert(error), () => {
      this.alert.loadingAlert(refModal, false);
    });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Validate formcontrolname if disabled or enabled
  --------------------------------------------------------------------------------------------------------------------------*/
  public disabledControl(formControlName: string, active: boolean) {
    if (active) {
      this.studiesForm.controls[formControlName].disable();
    } else {
      this.studiesForm.controls[formControlName].enable();
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Validate send data server
  --------------------------------------------------------------------------------------------------------------------------*/
  public onValidateSend() {
    const todayParse = Date.parse(Utilities.formatConcatDate(this._today.year, this._today.month, this._today.day))
    /* Validate if it is in progress, the end date is not greater than the current one */
    const finishDateParse = Date.parse(Utilities.formatConcatDate(this.payload.yearsFinish, this.payload.monthsFinish, this.payload.daysFinish))
    if (finishDateParse > todayParse) {
      return this.warningAlert("La fecha de finalización no puede ser mayor a la fecha actual")
    }
    /* Validate if it is not in progress and it is not without a certificate or in process and you have not attached a document */
    if (!this.payload.isSinCertificate && !this.payload.isInTramite) {
      if (!this.academicFile.Data && !this.payload.cea) {
        return this.warningAlert("Adjunte un documento para continuar")
      }
    }

    if (this.payload.isInProcess) {
      const startDateCertificateParse = Date.parse(Utilities.formatConcatDate(
        this.payload.startDateCertificate.year,
        this.payload.startDateCertificate.month,
        this.payload.startDateCertificate.day))
      const finishDateCertificateParse = Date.parse(Utilities.formatConcatDate(
        this.payload.finishDateCertificate.year,
        this.payload.finishDateCertificate.month,
        this.payload.finishDateCertificate.day))
      if (startDateCertificateParse < finishDateParse) {
        return this.warningAlert("La fecha inicio de vigencia no debe ser menor a la fecha de finalización del estudio")
      }
      if (finishDateCertificateParse < startDateCertificateParse) {
        return this.warningAlert("La fecha fin de vigencia no puede ser menor a la fecha inicio de vigencia")
      }
    }

    return true
  }
  /*------------------------------------------------------------------------------------------------------------------------
   Send data to server 
 --------------------------------------------------------------------------------------------------------------------------*/
  async save() {
    if (this.studiesForm.invalid) return;
    let payload = this.payload;
    this.submitting$.next(true);
    this.loadingData = true
    /* If exists error return false */
    if (!this.onValidateSend()) {
      this.submitting$.next(false)
      this.loadingData = false
      return
    }
    /* Validate if not in progress, format the end date for the database */
    payload.finishedDate = Utilities.formatConcatDate(payload.yearsFinish, payload.monthsFinish, payload.daysFinish)
    /* Validate if the document has an effective date, format the value of the calendar dates for the database */
    if (payload.isInProcess) {
      payload.startDateCertificate = Utilities.formatConcatDate(payload.startDateCertificate.year, payload.startDateCertificate.month, payload.startDateCertificate.day)
      payload.finishDateCertificate = Utilities.formatConcatDate(payload.finishDateCertificate.year, payload.finishDateCertificate.month, payload.finishDateCertificate.day)
    }
    /* Format data to FormData and check if there is an attachment */
    const formData = Utilities.jsonToFormData(payload);
    if (this.academicFile.Data && (!payload.isSinCertificate && !payload.isInTramite)) {
      formData.append('file', this.academicFile.Data);
    }
    try {
      let saveResponse: ApiResponse;
      /* Update data */
      if (this.data.id) {
        saveResponse = await this.api.putData(Entities.userStudies, formData, this.data.id).toPromise() as ApiResponse;
        this.successAlert(saveResponse.message);
        this.modalRef.modalRef.close({ refresh: true });
      } else {
        /* Create data */
        saveResponse = await this.api.postData(Entities.userStudies, formData).toPromise() as ApiResponse;
        this.successAlert(saveResponse.message);
        this.modalRef.modalRef.close({ refresh: true });
      }
    } catch (error) {
      this.submitting$.next(false)
      this.loadingData = false
      this.errorAlert(error.message)
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
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
  warningAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.WARNING,
      icon: COLORS.WARNING,
      bgTop: true,
      closeButton: true,
      closeBackDrop: true
    })
  }
}
