import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Entities } from '@services/entities';
import { IAdministrator } from '@apptypes/entities/administrator';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { IIdentificationType } from '@apptypes/entities/identification-type';
import { IUserType } from '@apptypes/entities/user-type';
import { ISector } from '@apptypes/entities/sector';
import { IState } from '@apptypes/entities/state';
import { ICity } from '@apptypes/entities/city';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Utilities } from '@utils/utilities';
import { ApiResponse } from '@apptypes/api-response';
import { RegexUtils } from '@utils/regex-utils';
import { UserAccountService } from '@services/user-account.service';
import { ValidateUsernameNotTaken } from '@utils/validators/async-username.validator';

@Component({
	selector: 'app-form-users',
	templateUrl: './form-users.component.html',
	styleUrls: ['./form-users.component.scss']
})
export class FormUsersComponent implements OnInit {

	public _error: string = '';
	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;

	public FormEntity: FormGroup;
	public _idEntity: any;
	public _Entity: any;

	public _identificationTypes: IIdentificationType[];
	public _userTypes: IUserType[];

	public _sectors: ISector[];

	public _states: IState[] = [];
	public _cities: ICity[] = [];
	public _loadingCities: boolean;

	private _currentUser: any;


	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService,
		private userAccount: UserAccountService
	) { }

	async ngOnInit() {
		this._loading = false;
		this._loadingCities = false;
		this._loadingForm = true;

		this._currentUser = this.api.getCurrentUser();

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;

			if (this._idEntity) {
				let resp = await this.api.get(Entities.administrators, this._idEntity).toPromise();
				console.log(resp.response);
        this._Entity = resp.response.registerDetails;

				this._btnText = 'Actualizar';

			} else {
				this._btnText = 'Crear usuario';
				this._Entity = {
					name: '',
					email: '',
					userTypeId: null,
					identificationTypeId: null,
					identification: '',
					sectorId: null,
					company: '',
					cityAdministratorId: null,
					serviceType: ''
				}
			}

			this.initForm();

			let respIdentificationTypes = await this.api.get(Entities.identificationTypes, null, 1, 100).toPromise();
			this._identificationTypes = respIdentificationTypes.response.data;

			let respUserTypes = await this.api.get(Entities.userTypes, null, 1, 100).toPromise();
			this._userTypes = respUserTypes.response.data.filter(x => x.id < 3);

			let respSectors = await this.api.get(Entities.sectors, null, 1, 100).toPromise();
			this._sectors = respSectors.response.data;

			let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
			this._states = stateResp.response.data;

		} catch (err) {
			this._error = err;
			console.error('ngOnInit(): ', this._error);
		}

		this._loadingForm = false;
	}

	private async initForm() {

		let stateId = (this._Entity.city) ? this._Entity.city.stateId : null;

		let email = (this._Entity.credential) ? this._Entity.credential.email : '';
		let username = (this._Entity.credential) ? this._Entity.credential.username : '';

		this.FormEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			email: new FormControl(email, [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail),
				Validators.maxLength(60)
			]),
			username: new FormControl(username, [
				Validators.required,
				Validators.pattern(RegexUtils._username)
			],
				ValidateUsernameNotTaken.createValidator(this.api, this._idEntity)),
			userTypeId: new FormControl(this._Entity.userTypeId, [
				Validators.required
			]),
			identificationTypeId: new FormControl(this._Entity.identificationTypeId, [
				Validators.required
			]),
			identification: new FormControl(this._Entity.identification, [
				Validators.required,

			]),
			sectorId: new FormControl(this._Entity.sectorId, [
				Validators.required
			]),
			stateId: new FormControl(stateId, [
				Validators.required
			]),
			cityId: new FormControl(this._Entity.cityAdministratorId, [
				Validators.required
			]),
			serviceType: new FormControl('Service Type', [
				Validators.required
			])
		});

		let _department = stateId;
		if (_department) {
			//Cargar ciudades
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}
	}

	public async save() {
		try {
			let entityForm: any = this.FormEntity.value;
			console.log(entityForm);

			entityForm.identification = entityForm.identification + '';

			if (this.FormEntity.valid) {
				this._loading = true;

				let saveResponse: ApiResponse;

				if (this._idEntity) {
					// Edit Form
					// saveResponse = await this.api.putData(Entities.administrators, entityForm, this._idEntity).toPromise() as ApiResponse;
					saveResponse = await this.api.putData(Entities.administrators, entityForm, this._Entity.credentialId).toPromise() as ApiResponse;
					if (this._currentUser.id == this._idEntity) {
						// Actualizar la información del usuario actual
						let response = await this.api.get(Entities.userAdministrator).toPromise();
						let user = response.response;
						this.userAccount.setUser(user);
					}
				} else {
					// Create Form
					saveResponse = await this.api.postData(Entities.administrators, entityForm).toPromise() as ApiResponse;
				}

				this.alert.success(saveResponse.message);
				this.back();
			} else {
				Utilities.markAsDirty(this.FormEntity);
			}

		} catch (err) {
			// alert(err);
			this.alert.error(err);
		}

		this._loading = false;
	}

	public async changeDepartment(event: any) {
		const departmentID = event.target.value;
		this._cities = [];
		this.FormEntity.controls.cityId.setValue("");

		if (departmentID != '' && departmentID != null && departmentID != undefined) {
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}
	}

	public back() {
		this.router.navigate(['admin/users']);
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute });
		}
	}
}
