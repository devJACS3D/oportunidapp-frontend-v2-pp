import { Component, OnInit } from '@angular/core';
import { RegexUtils } from '@utils/regex-utils';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { image } from '@apptypes/image';
import { IState } from '@apptypes/entities/state';
import { ICity } from '@apptypes/entities/city';
import { Api } from '@utils/api';
import { UserAccountService } from '@services/user-account.service';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { ApiResponse } from '@apptypes/api-response';
import { ModalQualifyComponent } from 'src/app/components/modals/modal-qualify/modal-qualify.component';
import { ModalService } from 'src/app/components/modal/modal.service';
import { QUALIFY } from '@apptypes/enums/qualify';
import { merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-company-profile',
	templateUrl: './company-profile.component.html',
	styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {

	public _maskPhone = RegexUtils._maskPhone;
	public _maskNumber = RegexUtils._maskNumber;

	public _errorMessage: string = '';

	public FormEntity: FormGroup;
	public _error: string = '';
	public currentUser: any;
	public packs: any;
	public _userImage: image = {};
	public _loadingImg: boolean;

	public _editMode: boolean;

	public _loading: boolean;
	public _loadingInit: boolean;

	public _loadingCities: boolean;
	public _loadingExpeditionCities: boolean;
	public _states: IState[] = [];
	public _cities: ICity[] = [];
	public _expeditionCities: ICity[] = [];

	public _businessProfile: boolean = false;
	public buttonCanRate$: Observable<{ qualified: boolean }>;
	public isRatedSubject$ = new Subject<{ qualified: boolean }>();

	constructor(
		private api: Api,
		private userAccount: UserAccountService,
		private alert: DialogService,
		private modalService: ModalService,
	) { }

	async ngOnInit() {
		this._loading = false;
		this._editMode = false;
		this._loadingImg = false;
		this._loadingCities = false;
		this._loadingInit = true;
		this.packs = [];
		this._userImage.Url = 'assets/empty.jpg';

		this.currentUser = this.api.getCurrentUser();

		this._businessProfile = (this.currentUser.userTypeId == 3) ? true : false;

		try {

			let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
			this._states = stateResp.response.data;

			await this.loadUser();

		} catch (err) {
			this._error = err;
		}
		// Verificar si cuenta con un plan activo

		if (!this._businessProfile) {

		} else {
			console.log('No empresa');

		}
		//this.loadPacks();
		this._loadingInit = false
		this.buttonCanRate$ = merge(this.isRatedSubject$, this.showButtonCanRate())
	}

	public editProfile() {
		this.initForm();
		this._errorMessage = '';
		this._editMode = true;
	}

	private loadUser() {
		return new Promise(async (resolve, reject) => {
			try {

				let response = await this.api.get(Entities.userCompany).toPromise();
				this.currentUser = response.response;

				if (this.currentUser.url) {
					let imageObj = this.currentUser.url;
					this._userImage.Url = imageObj;
				}

				this.initForm();

				resolve('ok')
			} catch (err) {
				reject(err);
			}
		});
	}

	private loadPacks() {
		return new Promise(async (resolve, reject) => {
			try {

				let response = await this.api.get(Entities.companies_pack, null, 1, 10).toPromise();
				this.packs = response.response.data;
				console.log('packs', this.packs);
				resolve('ok');
			} catch (err) {
				reject(err);
			}
		});
	}

	private async initForm() {
		let stateId: any = (this.currentUser.city) ? this.currentUser.city.stateId : '';
		let exstateId: any = (this.currentUser.expeditionCity) ? this.currentUser.expeditionCity.stateId : '';

		this.FormEntity = new FormGroup({
			username: new FormControl(this.currentUser.username, [
				Validators.required,
				Validators.pattern(RegexUtils._username)
			]),
			email: new FormControl(this.currentUser.email, [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail),
				Validators.maxLength(60)
			]),

			name: new FormControl(this.currentUser.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			nameComercial: new FormControl(this.currentUser.nameComercial, [
				Validators.required,
				Validators.maxLength(100)
			]),
			nit: new FormControl(this.currentUser.nit, [
				Validators.required,
				Validators.maxLength(11)
			]),
			ciiu: new FormControl(this.currentUser.ciiu, [
				Validators.required,
				Validators.maxLength(100)
			]),

			economicActivity: new FormControl(this.currentUser.economicActivity, [
				Validators.required,
				Validators.maxLength(100)
			]),
			typeOfTaxPayer: new FormControl(this.currentUser.typeOfTaxPayer, [
				Validators.required,
				Validators.maxLength(100)
			]),
			retainerTitleRent: new FormControl(this.currentUser.retainerTitleRent, [
				Validators.required,
				Validators.maxLength(100)
			]),

			stateId: new FormControl(stateId, [
				Validators.required
			]),
			cityId: new FormControl(this.currentUser.cityId, [
				Validators.required
			]),
			address: new FormControl(this.currentUser.address, [
				Validators.required,
				Validators.maxLength(100)
			]),
			telephones: new FormControl(this.currentUser.telephones, [
				Validators.required,
				Validators.pattern(RegexUtils._rxPhone)
			]),

			legalRepresentativeName: new FormControl(this.currentUser.legalRepresentativeName, [
				Validators.required,
				Validators.maxLength(100)
			]),
			dniLegalRepresentative: new FormControl(this.currentUser.dniLegalRepresentative, [
				Validators.required,
				Validators.maxLength(15)
			]),
			expeditionStateId: new FormControl(exstateId, [
				Validators.required
			]),
			expeditionCityId: new FormControl(this.currentUser.expeditionCityId, [
				Validators.required
			]),

			contactName: new FormControl(this.currentUser.contactName, [
				Validators.required,
				Validators.maxLength(100)
			]),
			positionContact: new FormControl(this.currentUser.positionContact, [
				Validators.required,
				Validators.maxLength(100)
			]),
			cellphoneContact: new FormControl(this.currentUser.cellphoneContact, [
				Validators.required,
				Validators.pattern(RegexUtils._rxPhone)
			]),
			telephoneContact: new FormControl(this.currentUser.telephoneContact, [
				Validators.required,
				Validators.pattern(RegexUtils._rxPhone)
			]),
			extTelephoneContact: new FormControl(this.currentUser.extTelephoneContact, [
				// Validators.required,
				Validators.pattern(RegexUtils._rxPhone),
				Validators.maxLength(5)
			]),
			emailContact: new FormControl(this.currentUser.emailContact, [
				Validators.required,
				Validators.pattern(RegexUtils._rxEmail),
				Validators.maxLength(60)
			]),

			numberWorkers: new FormControl(100, [
				Validators.required,
			]),
			numberWorkersDirect: new FormControl(this.currentUser.numberWorkersDirect, [
				Validators.required,
				Validators.pattern(RegexUtils._rxNumber),
				Validators.maxLength(5)
			]),
			numberWorkersTemporals: new FormControl(this.currentUser.numberWorkersTemporals, [
				Validators.required,
				Validators.pattern(RegexUtils._rxNumber),
				Validators.maxLength(5)
			]),
			numberWorkersOthers: new FormControl(this.currentUser.numberWorkersOthers, [
				Validators.required,
				Validators.pattern(RegexUtils._rxNumber),
				Validators.maxLength(5)
			]),
			numberWorkersToFind: new FormControl(this.currentUser.numberWorkersToFind, [
				Validators.required,
				Validators.pattern(RegexUtils._rxNumber),
				Validators.maxLength(5)
			])
		});

		this.FormEntity.valueChanges.subscribe(change => {
			this._errorMessage = '';
		});

		let _department = this.FormEntity.controls.stateId.value;
		if (_department != null && _department != undefined && _department != "" && _department != 0 && _department != "0") {
			//Cargar ciudades 
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}

		let _expeditionDepartment = this.FormEntity.controls.expeditionStateId.value;
		if (_expeditionDepartment && _expeditionDepartment != "0") {
			//Cargar ciudades 
			this._loadingExpeditionCities = true;

			let citiesResp2 = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _expeditionDepartment }).toPromise();
			this._expeditionCities = citiesResp2.response.data;
			this._loadingExpeditionCities = false;
		}
	}

	public async save() {
		if (this.FormEntity.valid) {
			this._loading = true;

			try {
				const body = this.FormEntity.value;
				let saveResp = await this.api.put(Entities.userCompany, body, '').toPromise() as ApiResponse;

				await this.loadUser();
				this.userAccount.setUser(this.currentUser);

				this._editMode = false;

				this.alert.success(saveResp.message);

			} catch (err) {
				this.alert.error(err);
			}

			this._loading = false;
		} else {
			Utilities.markAsDirty(this.FormEntity);
			this._errorMessage = 'Hay campos inválidos o campos sin completar';
		}
	}

	public async changeDepartment(kindCity: number) {
		let departmentID: any;
		if (kindCity == 1) {
			departmentID = this.FormEntity.controls.stateId.value;
			this._cities = [];
			this.FormEntity.controls.cityId.setValue("");
		} else {
			departmentID = this.FormEntity.controls.expeditionStateId.value;
			this._expeditionCities = [];
			this.FormEntity.controls.expeditionCityId.setValue("");
		}


		if (departmentID != '' && departmentID != null && departmentID != undefined) {
			if (kindCity == 1) this._loadingCities = true;
			else this._loadingExpeditionCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();

			if (kindCity == 1) {
				this._cities = citiesResp.response.data;
				this._loadingCities = false;
			} else {
				this._expeditionCities = citiesResp.response.data;
				this._loadingExpeditionCities = false;
			}
		}
	}

	/** Verificar la ruta en la que se subira la imagen */
	public async saveImg() {
		if (this._userImage.Data) {
			this._loadingImg = true;
			try {
				const body = { filename: this._userImage.Name };
				let formData = Utilities.getFormData(body);
				formData.append('image', this._userImage.Data);
				// /companies/update-photo/1
				//const response = await this.api.putData(Entities.userAdministratorImage, formData, '').toPromise();

				const response = await this.api.putData('companies/update-photo/' + this.currentUser.id, formData, '').toPromise();

				this._userImage.Name = null;
				this._userImage.Data = null;

				await this.loadUser();
				this.userAccount.setUser(this.currentUser);

				this.alert.success(response.message);

			} catch (err) {
				this.alert.error(err);
			}
			this._loadingImg = false;
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

	/*------------------------------------------------------------------------------------------------------------------------
	 Rate the opportuniapp platform
	--------------------------------------------------------------------------------------------------------------------------*/
	companyCanRate() {
		const modal = this.modalService.create(ModalQualifyComponent, {
			data: {
				title: 'Calificar Plataforma',
				fullName: 'Oportunidapp',
				typeQualify: QUALIFY.PLATFORM
			}
		});
		modal.afterDestroy$.subscribe(res => { if (res.qualified) this.isRatedSubject$.next(res) });
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  Check if there is no previous qualification and if the time limit has been met to be able to show the qualify platform button
	--------------------------------------------------------------------------------------------------------------------------*/
	public showButtonCanRate(): Observable<{ qualified: boolean }> {
		return this.api.get(`${Entities.qualifications}/list/canQualify`)
			.pipe(
				map(res => res.response)
			)
	}
}
