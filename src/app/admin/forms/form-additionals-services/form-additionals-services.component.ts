import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { ApiResponse } from '@apptypes/api-response';
import { RegexUtils } from '@utils/regex-utils';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ICity } from '@apptypes/entities/city';
import { IState } from '@apptypes/entities/state';

@Component({
	selector: 'app-form-additionals-services',
	templateUrl: './form-additionals-services.component.html',
	styleUrls: ['./form-additionals-services.component.scss']
})
export class FormAdditionalsServicesComponent implements OnInit {

	private entidad: string = Entities.additionalsServices;

	public maskCurrency: RegExp = RegexUtils._maskCurrency;

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;

	public _formEntity: FormGroup;
	private _idEntity: number;
	public _Entity: IAdditionalService;

	public _cities: ICity[] = [];
	public _loadingCities: boolean;
	public _states: IState[] = [];


	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) {
		this._formEntity = new FormGroup({
			name: new FormControl('', [
				Validators.required,
				Validators.maxLength(100)
			]),
			price: new FormControl('', [
				Validators.required,
				Validators.pattern(RegexUtils._rxCurrency),
				Validators.maxLength(14)
			]),
			description: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			]),
			stateId: new FormControl(null, [
				Validators.required
			]),
			cityId: new FormControl(null, [
				Validators.required
			]),

		});
	}

	async ngOnInit() {
		this._loading = false;
		this._loadingForm = true;

		this._idEntity = this.activatedRoute.snapshot.params.id;

		if (this._idEntity) {
			// Edit Form
			this._title = 'Editar servicio';
			this._btnText = 'Actualizar';
			this.api.get(this.entidad, this._idEntity).subscribe((resp: ApiResponse) => {
				this._loadingForm = false;
				this._Entity = resp.response.registerDetails;

				this.initForm();
			}, err => {
				this._loading = false;
				alert(err);
			});

		} else {
			// Create Form
			this._title = 'Crear servicio';
			this._btnText = 'Crear';

			this._Entity = {
				name: '',
				description: '',
				price: null,
				stateId: null,
				cityId: null,
			}


			this._loadingForm = false;
			this.initForm();
		}
		let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
		this._states = stateResp.response.data;

	}

	private async initForm() {


		console.log(this._Entity.cityId);
		this._formEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			price: new FormControl(this._Entity.price, [
				Validators.required,
				Validators.pattern(RegexUtils._rxCurrency),
				Validators.maxLength(14)
			]),
			description: new FormControl(this._Entity.description, [
				Validators.required,
				Validators.maxLength(500)
			]),
			stateId: new FormControl(this._Entity.city.stateId, [
				Validators.required
			]),
			cityId: new FormControl(this._Entity.cityId, [
				Validators.required
			]),

		});
		if (this._idEntity) {
			const departmentID = this._Entity.city.stateId;
			this._formEntity.controls.cityId.setValue(this._Entity.cityId);
			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}


	}


	public submitForm() {
		if (this._formEntity.valid) {

			this._loading = true;

			let formValue = this._formEntity.value;
			formValue.price = RegexUtils._unMaskCurrency(formValue.price);

			let body = { ...formValue, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt };

			if (this._idEntity) {
				// Edit Form
				this.api.put(this.entidad, body, this._idEntity).subscribe((resp: ApiResponse) => {
					this._loading = false;

					// alert(resp.message);
					this.alert.success(resp.message);
					this.back();
				}, err => {
					this._loading = false;
					alert(err);
				});
			} else {
				// Create Form

				this.api.post(this.entidad, body).subscribe((resp: ApiResponse) => {
					this._loading = false;

					// alert(resp.message);
					this.alert.success(resp.message);
					this.back();
				}, err => {
					this._loading = false;
					alert(err);
				});
			}

		} else {
			alert('Campos vacios o inválidos. Por favor complete información correctamente.');
		}
	}

	public back() {
		this.router.navigate(['admin/additionals-services']);
	}

	public async changeDepartment(event: any) {
		const departmentID = event.target.value;
		this._cities = [];
		this._formEntity.controls.cityId.setValue("");

		if (departmentID != '' && departmentID != null && departmentID != undefined) {
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute });
		}
	}
}
