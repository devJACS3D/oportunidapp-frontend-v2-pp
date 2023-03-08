import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from "@utils/api";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { Entities } from "@services/entities";
import { ApiResponse } from "@apptypes/api-response";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Subject } from 'rxjs';
import { COLORS, MESSAGE } from 'src/app/constants/constants';
import { IFile } from "@apptypes/image";
import { RegexUtils } from '@utils/regex-utils';
import { UPLOAD } from "@apptypes/enums/uploadFiles";

@Component({
	selector: 'app-form-experiences',
	templateUrl: './form-experiences.component.html',
	styleUrls: ['./form-experiences.component.scss']
})
export class FormExperiencesComponent implements OnInit {
	public _title: string;
	public _maskPhone = RegexUtils._maskPhone;
	public submitting$ = new Subject();
	public experienciesForm: FormGroup;
	public _days = Utilities.onDays();
	public _months = Utilities.onMonths();
	public _years = Utilities.onYears();
	public _today = Utilities.formatDate(moment().unix());
	public experienciesFile: IFile = { Name: 'Adjuntar documento' };
	public loadingData: boolean = false;
	public utils = Utilities
	public isInProcess: boolean = false


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
			...this.experienciesForm.value,
		}
		return payload;
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	async initForm(initValues?: any) {
		const startDate = Utilities.onSplitDate(initValues.startDate)
		const finishDate = Utilities.onSplitDate(initValues.finishDate)
		this.experienciesForm = this.formBuilder.group({
			company: [initValues.company, [Validators.required]],
			employment: [initValues.employment, [Validators.required]],
			functions: [initValues.functions, [Validators.required]],
			reasonWithdrawal: [initValues.reasonWithdrawal, [Validators.required]],
			cellphone: [initValues.cellphone, [Validators.required]],
			boss: [initValues.boss, [Validators.required]],
			daysInit: [startDate.day, [Validators.required]],
			monthsInit: [startDate.month, [Validators.required]],
			yearsInit: [startDate.year, [Validators.required]],
			daysFinish: [finishDate.day, [Validators.required]],
			monthsFinish: [finishDate.month, [Validators.required]],
			yearsFinish: [finishDate.year, [Validators.required]],
			currentlyWorkHere: [initValues.currentlyWorkHere, [Validators.required]],
			isInProcess: [initValues.isInProcess, [Validators.required]],
			cea: [initValues.cea, []],
			cl: ["", []]
		});

		this.checkDocument(this.payload.isInProcess)
		this.checkCurrentlyWorkHere(this.payload.currentlyWorkHere)
	}
	/*------------------------------------------------------------------------------------------------------------------------
   Validate if the attached document is valid
 --------------------------------------------------------------------------------------------------------------------------*/
	public checkDocument(active: boolean) {
		this.isInProcess = active
	}
	/*------------------------------------------------------------------------------------------------------------------------
	Validate if the attached document is valid
  --------------------------------------------------------------------------------------------------------------------------*/
	public checkCurrentlyWorkHere(active: boolean) {
		const listItem = ['daysFinish', 'monthsFinish', 'yearsFinish', 'reasonWithdrawal'];
		listItem.map(control => this.disabledControl(control, active))
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public itemDisabled() {
		return this.payload.isInProcess
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public onUploadCertificate() {
		Utilities.onUploadFile((data: any) => {
			if (data.error) return this.warningAlert(data.error)
			this.experienciesFile = data
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
	async deleteCertificate(experiencie: any) {
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
						ref.delete(experiencie, this)
					}
				}
			]
		})
	}
	private delete(experiencie: any, refModal) {
		this.api.put(Entities.userExperiences, {
			cea: null,
			isInProcess: false
		}, experiencie.id).subscribe(async res => {
			this.alert.closeAlert();
			this.experienciesForm.controls.cea.setValue(null)
			this.modalRef.modalRef.refresh({ experiencie });
			this.experienciesFile = { Data: null, Name: 'Adjuntar documento' }
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
			this.experienciesForm.controls[formControlName].disable();
		} else {
			this.experienciesForm.controls[formControlName].enable();
		}
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  Validate send data server
	--------------------------------------------------------------------------------------------------------------------------*/
	public onValidateSend() {
		const todayParse = Date.parse(Utilities.formatConcatDate(this._today.year, this._today.month, this._today.day))
		const startDate = Date.parse(Utilities.formatConcatDate(this.payload.yearsInit, this.payload.monthsInit, this.payload.daysInit))
		const finishDateParse = Date.parse(Utilities.formatConcatDate(this.payload.yearsFinish, this.payload.monthsFinish, this.payload.daysFinish))
		if (startDate > todayParse) {
			return this.warningAlert("La fecha de ingreso no debe ser mayor a la fecha actual")
		}
		if (finishDateParse < startDate) {
			return this.warningAlert("La fecha de retiro no debe ser menor a la fecha de ingreso")
		}
		if (!this.payload.isInProcess && !this.payload.currentlyWorkHere) {
			if (!this.experienciesFile.Data && !this.payload.cea) {
				return this.warningAlert("Adjunte un documento para continuar")
			}
		}
		return true
	}
	/*------------------------------------------------------------------------------------------------------------------------
	 Send data to server 
   --------------------------------------------------------------------------------------------------------------------------*/
	async save() {
		if (this.experienciesForm.invalid) return;
		let payload = this.payload;
		this.submitting$.next(true);
		this.loadingData = true
		/* If exists error return false */
		if (!this.onValidateSend()) {
			this.submitting$.next(false)
			this.loadingData = false
			return
		}
		payload.startDate = Utilities.formatConcatDate(payload.yearsInit, payload.monthsInit, payload.daysInit)
		if (!payload.currentlyWorkHere) {
			payload.finishDate = Utilities.formatConcatDate(payload.yearsFinish, payload.monthsFinish, payload.daysFinish)
		}
		// return console.log(payload)
		/* Format data to FormData and check if there is an attachment */
		const formData = Utilities.jsonToFormData(payload);
		if (this.experienciesFile.Data && !payload.isInProcess) {
			formData.append('file', this.experienciesFile.Data);
		}
		try {
			let saveResponse: ApiResponse;
			/* Update data */
			if (this.data.id) {
				saveResponse = await this.api.putData(Entities.userExperiences, formData, this.data.id).toPromise() as ApiResponse;
				this.successAlert(saveResponse.message);
				this.modalRef.modalRef.close({ refresh: true });
			} else {
				/* Create data */
				saveResponse = await this.api.postData(Entities.userExperiences, formData).toPromise() as ApiResponse;
				this.successAlert(saveResponse.message);
				this.modalRef.modalRef.close({ refresh: true });
			}
		} catch (error) {
			this.submitting$.next(false)
			this.loadingData = false
			this.errorAlert(error)
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
