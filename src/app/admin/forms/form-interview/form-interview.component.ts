import { Component, OnInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Utilities } from '@utils/utilities';
import * as moment from 'moment';
import { Entities } from '@services/entities';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponse } from '@apptypes/api-response';
import { IVacancy } from '@apptypes/entities/vacancy';

@Component({
	selector: 'app-form-interview',
	templateUrl: './form-interview.component.html',
	styleUrls: ['./form-interview.component.scss']
})
export class FormInterviewComponent implements OnInit {

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;
	public _showError: boolean = false;
	public _error: string = '';

	public FormEntity: FormGroup;
	private _idEntity: number;
	public _Entity: any;

	public _minDate: any;
	public _timeToshow: string;

	public _editMode: boolean;

	public _showConfirm: boolean;
	public _loadingConfirm: boolean;
	public _confirmMessage: string;

	public _approved: boolean;

	public _loadingComment: boolean;
	public _comment: string;


	public _vacancies: IVacancy[] = [];
	public _interViewers: any[] = [];
	public _candidates: any[] = [];

	public _loadingCandidates: boolean;

	public _errorMessage: string;

	/**
	 * 1: Editar, crear, eliminar
	 * 2: Marcar entrevista como realizada
	 * 3: Añadir comentario
	 */
	public viewState: number;

	private currentUser: any;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	async ngOnInit() {
		this.currentUser = this.api.getCurrentUser();

		this._approved = false;
		this._loadingComment = false;
		this._loadingCandidates = false;

		this.viewState = 1;

		this._loadingConfirm = false;
		this._loading = false;
		this._loadingForm = true;
		this._editMode = false;

		this._minDate = Utilities.formatDate(moment().unix());

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;
			if (this._idEntity) {

				let strEntity = (this.currentUser.userTypeId == 1) ? Entities.interviews : Entities.psychologistsInterviews;

				let resp = await this.api.get(strEntity, this._idEntity).toPromise();
				this._Entity = resp.response;

				this._btnText = 'Actualizar';
				this._title = (this._Entity.done) ? 'Entrevista realizada' : 'Entrevista pendiente';
			} else {
				this._editMode = true;
				let initialDate = this.activatedRoute.snapshot.params.date;
				let initialHour = this.activatedRoute.snapshot.params.time;


				this._btnText = 'Guardar';
				this._title = 'Agendar entrevista';

				this._Entity = {
					date: initialDate,
					hour: this.setBackFormat(initialHour),
					vacancyId: '',
					interviewerId: '',
					address: '',
				}
			}

			let respVacancies = await this.api.get(Entities.vacancies, null, 1, 100000).toPromise();
			this._vacancies = respVacancies.response.data;

			let respInterviewers = await this.api.get(Entities.interviewersSearch, null, null, null, { search: '' }).toPromise();
			this._interViewers = respInterviewers.response;

			if (this._idEntity) {
				let respCandidates = await this.api.get(Entities.candidatesSearch, null, null, null, { search: '', vacancyId: this._Entity.vacancyId }).toPromise();
				this._candidates = respCandidates.response;
			}

			this.initForm();
		} catch (err) {
			this._error = err;
		}

		this._loadingForm = false;
	}

	public async changeVacancy(event: any) {
		const vacancyID = event.target.value;
		this._candidates = [];
		this.FormEntity.controls.userId.setValue("");

		if (vacancyID != '' && vacancyID != null && vacancyID != undefined) {
			this._loadingCandidates = true;

			let respCandidates = await this.api.get(Entities.candidatesSearch, null, null, null, { search: '', vacancyId: vacancyID }).toPromise();
			this._candidates = respCandidates.response;

			this._loadingCandidates = false;
		}
	}

	public async markAsDone() {
		if (this._comment) {
			this._loadingComment = true;

			try {
				let body = { approved: this._approved, done: true, comment: this._comment, userId: this._Entity.userId, vacancyId: this._Entity.vacancyId };

				let resp = await this.api.put(Entities.interviews, body, this._idEntity).toPromise();

				this.alert.success(resp.message);

				this.back();

			} catch (err) {
				this.alert.error(err);
			}

			this._loadingComment = false;
		}
	}

	private setBackFormat(initialtime: string) {
		let time = initialtime.split(':');
		let formated = { hour: time[0].toString(), minutes: time[1].toString(), secound: time[2].toString() };
		console.log('formated: ', formated);
		return formated;
	}

	private initForm() {

		let date = (this._Entity.date != '') ? Utilities.formatDate(moment(this._Entity.date).unix()) : '';
		let hour: any = (this._Entity.hour != '') ? { hour: parseInt(this._Entity.hour.hour.toString()), minute: parseInt(this._Entity.hour.minutes), second: parseInt(this._Entity.hour.secound) } : '';
		console.log('hour value: ', hour);

		this.FormEntity = new FormGroup({
			date: new FormControl(date, [
				Validators.required
			]),
			hour: new FormControl(hour, [
				Validators.required
			]),
			userId: new FormControl(this._Entity.userId, [
				Validators.required,
			]),
			vacancyId: new FormControl(this._Entity.vacancyId, [
				Validators.required
			]),
			interviewerId: new FormControl(this._Entity.interviewerId, [
				Validators.required
			]),
			address: new FormControl(this._Entity.address, [
				Validators.required
			])
		});

		if (this._idEntity) {
			this.FormEntity.controls.userId.disable();
			this.FormEntity.controls.vacancyId.disable();
		}

		this.setTime(hour);
	}

	public async save() {

		this._errorMessage = '';
		// Validar la fecha y la hora de la entrevista.
		let formValue = this.FormEntity.value;
		let body = JSON.parse(JSON.stringify(formValue));

		console.log('formValue', formValue);


		if (this.FormEntity.valid) {

			body.date = Utilities.unixToDate(Utilities.unformatDate(body.date));
			body.hour = Utilities.pickerToBackTime(body.hour);

			let momentDate = moment(body.date + ' ' + this._timeToshow);
			let diffTime = moment().diff(momentDate, 'minutes');
			if (diffTime < 10) {
				this._loading = true;

				let response: ApiResponse;
				try {
					if (this._idEntity) {
						response = await this.api.put(Entities.interviews, body, this._idEntity).toPromise() as ApiResponse;
					} else {
						response = await this.api.post(Entities.interviews, body).toPromise() as ApiResponse;
					}

					this.alert.success(response.message);
					this.back();

				} catch (err) {
					this.alert.error(err);
				}
			} else {
				this._errorMessage = 'Debe indicar una fecha y hora mayor a la actual.';
			}

		} else {
			Utilities.markAsDirty(this.FormEntity);
			let body2 = this.FormEntity.value;
			console.log('FormEntity value post validation', body2);
		}

		this._loading = false;
	}

	public setTime(e: NgbTimeStruct) {
		this._errorMessage = '';

		if (e != null) {
			let timeString = Utilities.unformatTime(e);
			this._timeToshow = timeString;
		} else {
			this._timeToshow = '';
		}
	}

	public setDate() {
		let body = this.FormEntity.value;
		return Utilities.unixToDate(Utilities.unformatDate(body.date));
	}

	public back() {
		this.router.navigate(['admin']).then(() => {
			this.router.navigate(['admin/calendar']);
		});
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
		}
	}


	public closeConfirm($event) {
		if ($event) {
			this._showConfirm = false;
		}
	}

	public delete() {
		this._confirmMessage = `¿Desea eliminar la entrevista con ${this._Entity.user.firstName} ${this._Entity.user.lastName} ?`;
		this._showConfirm = true;
	}

	public async confirm($event) {
		if ($event) {
			this._loadingConfirm = true;

			try {
				let resp = await this.api.delete(Entities.interviews, this._idEntity).toPromise() as ApiResponse;
				this.alert.success(resp.message);
				this.back();

			} catch (err) {
				this.alert.error(err);
			}

			this._loadingConfirm = false;
			this._showConfirm = false;
		}
	}
}
