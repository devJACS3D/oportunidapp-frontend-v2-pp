import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IVacancy } from '@apptypes/entities/vacancy';
import { ISector } from '@apptypes/entities/sector';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { IState } from '@apptypes/entities/state';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { IWorkday } from '@apptypes/entities/workday';
import { IContractType } from '@apptypes/entities/contract-type';
import { IEducationalLevel } from '@apptypes/entities/educational-level';
import { ICity } from '@apptypes/entities/city';
import { RegexUtils } from '@utils/regex-utils';
import { Utilities } from '@utils/utilities';
import * as moment from 'moment';
import { ILanguage } from '@apptypes/entities/language';
import { IDrivingLicense } from '@apptypes/entities/driving-license';
import { ICompany } from '@apptypes/entities/company';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { image } from '@apptypes/image';

@Component({
	selector: 'app-form-company',
	templateUrl: './form-company.component.html',
	styleUrls: ['./form-company.component.scss']
})
export class FormCompanyComponent implements OnInit {


	public _error: string = '';

	public maskNumber: RegExp = RegexUtils._maskNumber;
	public maskCurrency: RegExp = RegexUtils._maskCurrency;

	public _showModalTest: boolean;
	public _showDetailService: boolean;

	public _vacancyImage: image = {};

	public _minDate: any;

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;
	public FormEntity: FormGroup;

	private _idEntity: number;
	public _Entity: any;

	public objAdditionalService: IAdditionalService;
	public _additionalServices: IAdditionalService[] = [];


	public _sectors: ISector[] = [];
	public _workdays: IWorkday[] = [];
	public _contractTypes: IContractType[] = [];
	public _educationalLevels: IEducationalLevel[] = [];
	public _companies: ICompany[] = [];
	public _drivingLicenses: IDrivingLicense[] = [];
	public _languages: ILanguage[] = [];
	public _tests: TestControl[];

	public _states: IState[] = [];
	public _cities: ICity[] = [];
	public _loadingCities: boolean;

	public company: any;

	public packs: any;



	public _errorMessage: string;

	public currentUser: any;
	public _businessProfile: boolean = false;

	public _amount: number = 0;
	public _vacancyId: number = 0;
	public _showPaymentModal: boolean = false;

	public _result: any;

	public mov: any;

	public _userImage: image = {};

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) {
		this.company = [];
		this.initForm();
	}

	async ngOnInit() {
		this.currentUser = this.api.getCurrentUser();

		if (this.activatedRoute.snapshot.params.id) {
			this._idEntity = this.activatedRoute.snapshot.params.id;
		} else {
			this._idEntity = this.currentUser.id
		}

		this._businessProfile = (this.currentUser.userTypeId  == 3) ? true : false;

		this._loading = false;
		this._loadingCities = false;
		this._loadingForm = true;
		this._showModalTest = false;
		this._showDetailService = false;

		this._minDate = Utilities.formatDate(moment().unix());

		this._vacancyImage.Url = 'assets/empty.jpg';
		// Obtenr Planes disponibles
		if (this._businessProfile) {
			this.loadPacksCompany(this.currentUser.id);
			this.getCompaniyById(this.currentUser.id);
		} else {
			this.loadPacks();
			this.getCompaniyById(this._idEntity);
		}




		try {
			if (this._idEntity) {
				// Edit form
				this._title = 'Editar Empresa';
				this._btnText = 'Actualizar';

				let strRequest = (this._businessProfile) ? Entities.company_vacany : Entities.vacancies;
				let resp: ApiResponse = await this.api.get(strRequest, this._idEntity).toPromise();

				this._Entity = resp.response;

			} else {
				// Create form
				this._title = 'Crear Empresa';
				this._btnText = 'Guardar';
			}

			this.initForm();

		} catch (err) {
			// alert(err);
			this._error = err;
		}
		this._loadingForm = false;
	}

	public close() {
		this._showModalTest = false;
	}

	editCompany() {
		let formValue;
		formValue = this.FormEntity.value;
		console.log('formValue', formValue);

		if (this.FormEntity.valid) {
			console.log('form valid');
			this.api.put(Entities.companies, formValue, this._idEntity).subscribe((resp: ApiResponse) => {
				this._loading = false;

				// alert(resp.message);
				this.alert.success(resp.message);
				this.back();
			}, err => {
				this._loading = false;
				//alert(err);
				this.alert.error(err);

			});

		} else {
			Utilities.markAsDirty(this.FormEntity);
		}

	}

	public showDetailService(service: IAdditionalService) {
		this.objAdditionalService = service;
		// Set objet to show
		this._showDetailService = true;
	}

	public closeDetailService() {
		this._showDetailService = false;
	}

	private async initForm() {
		this.FormEntity = new FormGroup({
			nit: new FormControl(this.company.nit, [
				Validators.required,
				Validators.maxLength(100)
			]),
			typeService: new FormControl(this.company.typeService=="null" ? null : this.company.typeService, [
				Validators.required,
				Validators.minLength(2)
			]),
			//email: new FormControl(this.company.email, []),
			name: new FormControl(this.company.name, [
				Validators.required,
				Validators.maxLength(500)
			]),
			ciiu: new FormControl(this.company.ciiu, [
				Validators.required
			]),
			economicActivity: new FormControl(this.company.economicActivity, [
				Validators.required
			]),
			typeOfTaxPayer: new FormControl(this.company.typeOfTaxPayer, [
				Validators.required
			]),
			retainerTitleRent: new FormControl(this.company.retainerTitleRent, [
				Validators.required
			]),
			address: new FormControl(this.company.address, [
				Validators.required,
			]),
			telephones: new FormControl(this.company.telephones, [
				Validators.required
			]),
			legalRepresentativeName: new FormControl(this.company.legalRepresentativeName, [
				Validators.required,
			]),
			dniLegalRepresentative: new FormControl(this.company.dniLegalRepresentative, [
				Validators.required,
			]),
			expeditionCityId: new FormControl(this.company.expeditionCityId, [
				//Validators.required,
			]),
			cityId: new FormControl(this.company.cityId, []),
			contactName: new FormControl(this.company.contactName, [
				Validators.required
			]),
			positionContact: new FormControl(this.company.positionContact, [
				Validators.required
			]),
			// companyId: new FormControl(this.company.companyId),
			cellphoneContact: new FormControl(this.company.cellphoneContact, [
				Validators.required
			]),
			telephoneContact: new FormControl(this.company.telephoneContact, [
				Validators.required
			]),
			extTelephoneContact: new FormControl(this.company.extTelephoneContact, [
				Validators.required
			]),
			emailContact: new FormControl(this.company.emailContact, [
				Validators.required
			]),
			numberWorkers: new FormControl(this.company.numberWorkers, [
				Validators.required
			]),
			numberWorkersDirect: new FormControl(this.company.numberWorkersDirect, [
				Validators.required
			]),
			numberWorkersTemporals: new FormControl(this.company.numberWorkersTemporals, [
				Validators.required
			]),
			numberWorkersOthers: new FormControl(this.company.numberWorkersOthers, [
				Validators.required
			]),
			numberWorkersToFind: new FormControl(this.company.numberWorkersToFind, [
				Validators.required
			])
		});

		/*		let _department = this.FormEntity.controls.stateId.value;
				if (_department != null && _department != undefined && _department != "" && _department != 0 && _department != "0") {
					//Cargar ciudades 
					this._loadingCities = true;
		
					let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: _department }).toPromise();
					this._cities = citiesResp.response.data;
					this._loadingCities = false;
				}*/


	}


	/**
	 * Verificar si la cuenta actua posee un plan para publicar vancates
	 */
	private loadPacks() {
		return new Promise(async (resolve, reject) => {
			try {
				let response = await this.api.get('administrator/vacancies/packages', null, 1, 10, { companyId: this._idEntity }).toPromise();
				this.packs = response.response.data;

				console.log('packs', this.packs);
				resolve('ok');
			} catch (err) {
				reject(err);
			}
		});
	}

	private loadPacksCompany(id) {
		return new Promise(async (resolve, reject) => {
			try {

				let response = await this.api.get('companies/vacancies/packages', null, 1, 10).toPromise();
				this.packs = response.response.data;
				console.log('packs loadPacksCompany', this.packs);
				resolve('ok');
			} catch (err) {
				reject(err);
			}
		});
	}


	public back() {
		this.router.navigate(['/admin/company/1/9']);
	}

	public goback() {
		// this.location.back();
		if (this._idEntity) {
			this.router.navigate(['/admin/company/1/9'], { relativeTo: this.activatedRoute })
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute })
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

	public onInputImageChange(event, id) {
		/*let file = event.target.files[0];
		let fileName = event.target.value;

		console.log('id img', id);


		let reader: FileReader = new FileReader();

		reader.onload = (e) => {
			let url = reader.result;
			this._userImage = {
				Url: url,
				Name: fileName,
				Data: file
			}
		}
		reader.readAsDataURL(file);
		console.log('id img', file);*/
	}

	public getImage(file: any) {
		let reader: FileReader = new FileReader();
		if (file.type.startsWith('image')) {
			reader.onload = (e) => {
				let url = reader.result;
				this._vacancyImage.Url = url;
			}
			reader.readAsDataURL(file);
		} else {
			alert('¡Sólo se admiten imágenes!');
		}
	}

	async getCompaniyById(id) {
		let citiesResp = await this.api.get(Entities.companies, id, 1, 1000).toPromise();
		this.company = citiesResp.response;


		// Obtenr Planes disponibles
		if (this._businessProfile) {
			// this.getCost(id);
		}
		this.paymentsByCompany(id);
		console.log('company', this.company);
		this.initForm();
	}

	async getCost(id) {
		let citiesResp = await this.api.get(Entities.companies_pack, null, 1, 1000).toPromise();
		this.packs = citiesResp.response;
		console.log('getCost', this.packs);
	}

	async paymentsByCompany(id) {
		let params = {
			"companyId": id
		};
		let res = await this.api.get(Entities.paymentsList, null, 1, 1000, params).toPromise();
		this.mov = res.response.data;
		let i = 0;
		this.mov.forEach(element => {
			this.mov[i].attached = JSON.parse(element.attached);
			i = i + 1;
		});

		console.log('mov', this.mov);

	}

	async updateInvoice() {
		if (this._userImage.Data) {
			try {
				const body = { filename: this._userImage.Name };
				let formData = Utilities.getFormData(body);
				formData.append('image', this._userImage.Data);

				const response = await this.api.putData(Entities.saveInvoice, formData, '').toPromise();
				this._userImage.Name = null;
				this._userImage.Data = null;
				this.alert.success(response.message);

			} catch (err) {
				this.alert.error(err);
			}

		}

	}



}

interface TestControl {
	id: number;
	name: string;
	selected?: boolean;
}
