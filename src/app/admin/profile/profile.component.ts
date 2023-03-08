import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { image } from '@apptypes/image';
import { Utilities } from '@utils/utilities';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegexUtils } from '@utils/regex-utils';
import { IIdentificationType } from '@apptypes/entities/identification-type';
import { ICity } from '@apptypes/entities/city';
import { IState } from '@apptypes/entities/state';
import { ApiResponse } from '@apptypes/api-response';
import { UserAccountService } from '@services/user-account.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	public _maskPhone = RegexUtils._maskPhone;

	public FormEntity: FormGroup;

	public _loadingCities: boolean;
	public _loading: boolean;
	public _loadingInit: boolean;
	public _error: string = '';
	public currentUser: any;

	public _userImage: image = {};
	public _loadingImg: boolean;

	public _editMode: boolean;

	public _identificationTypes: IIdentificationType[];

	public _states: IState[] = [];
	public _cities: ICity[] = [];

	constructor(
		private api: Api,
		private userAccount: UserAccountService,
		private alert: DialogService,
	) { }

	async ngOnInit() {
		this._loading = false;
		this._editMode = false;
		this._loadingImg = false;
		this._loadingCities = false;
		this._loadingInit = true;

		this.currentUser = this.userAccount.getUser();

		this._userImage.Url = 'assets/empty.jpg';

		try {
			let respIdentificationTypes = await this.api.get(Entities.identificationTypes, null, 1, 200).toPromise();
			this._identificationTypes = respIdentificationTypes.response.data;

			let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
			this._states = stateResp.response.data;


			await this.loadUser();

		} catch (err) {
			this._error = err;
			console.error('onInit catch', err);
		}

		this._loadingInit = false;
	}

	private loadUser() {
		return new Promise(async (resolve, reject) => {
			try {
				let response = await this.api.get(Entities.userAdministrator).toPromise();
				this.currentUser = response.response;

				if (this.currentUser.image) {
					let imageObj = JSON.parse(this.currentUser.image);
					this._userImage.Url = imageObj.Location;
				}

				this.initForm();

				resolve('ok')
			} catch (err) {
				reject(err);
			}
		});
	}

	private async initForm() {
		this.FormEntity = new FormGroup({
			userTypeId: new FormControl(this.currentUser.userTypeId, [
				Validators.required
			]),
			name: new FormControl(this.currentUser.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			telephone: new FormControl(this.currentUser.telephone, [
				Validators.required,
				Validators.maxLength(15),
				Validators.pattern(RegexUtils._rxPhone)
			]),
			identificationTypeId: new FormControl(this.currentUser.identificationTypeId, [
				Validators.required
			]),
			identification: new FormControl(this.currentUser.identification.toString(), [
				Validators.required,
				Validators.maxLength(15)
			]),
			email: new FormControl(this.currentUser.credential.email, [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail),
				Validators.maxLength(60)
			]),
			stateId: new FormControl(this.currentUser.cityAdministrator.stateId, [
				Validators.required
			]),
			cityId: new FormControl(this.currentUser.cityAdministratorId, [
				Validators.required
			])
		});

		let _department = this.FormEntity.controls.stateId.value;
		if (_department != null && _department != undefined && _department != "" && _department != 0 && _department != "0") {
			//Cargar ciudades 
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}
	}

	public async save() {
		if (this.FormEntity.valid) {
			console.log('in method');
			this._loading = true;

			try {
				const body = this.FormEntity.value;
				let saveResp = await this.api.put(Entities.userAdministrator, body, '').toPromise() as ApiResponse;

				await this.loadUser();
				this.userAccount.setUser(this.currentUser);

				this._editMode = false;

				this.alert.success(saveResp.message);
			} catch (err) {
				this.alert.error(err);
			}
		} else {
			console.log('form Invalid');
			Utilities.markAsDirty(this.FormEntity);
		}

		this._loading = false;
	}

	public async saveImg() {
		if (this._userImage.Data) {
			this._loadingImg = true;
			try {
				const body = { filename: this._userImage.Name };
				let formData = Utilities.getFormData(body);
				formData.append('image', this._userImage.Data);

				const response = await this.api.putData(Entities.userAdministratorImage, formData, '').toPromise();
				this._userImage.Name = null;
				this._userImage.Data = null;

				await this.loadUser();
				this.userAccount.setUser(this.currentUser);

				this.alert.success("Se cargo con éxito la foto de perfil.");

			} catch (err) {
				this.alert.error(err);
			}
			this._loadingImg = false;
		}
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


	public onInputImageChange(event) {
		let file = event.target.files[0];
		let fileName = event.target.value;

		let reader: FileReader = new FileReader();
		if (file.type.startsWith('image')) {
			reader.onload = (e) => {
				let url = reader.result;
				this._userImage = {
					Url: url,
					Name: fileName,
					Data: file
				}
			}
			reader.readAsDataURL(file);
		} else {
			this.alert.error('¡Sólo se admiten imágenes!');
		}
	}

}
