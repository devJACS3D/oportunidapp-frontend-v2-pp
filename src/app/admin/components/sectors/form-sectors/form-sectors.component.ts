import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiResponse } from '@apptypes/api-response';
import { ISector } from '@apptypes/entities/sector';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
	selector: 'app-form-sectors',
	templateUrl: './form-sectors.component.html',
	styleUrls: ['./form-sectors.component.scss']
})
export class FormSectorsComponent implements OnInit {

	private entidad: string = Entities.sectors;

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;

	public _formEntity: FormGroup;
	private _idEntity: number;
	public _Entity: ISector;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	ngOnInit() {
		this._loading = false;
		this._loadingForm = true;

		this._idEntity = this.activatedRoute.snapshot.params.id;

		if (this._idEntity) {
			// Edit Form
			this._title = 'Editar sector';
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
			this._title = 'Crear sector';
			this._btnText = 'Crear';

			this._Entity = {
				name: '',
				description: ''
			}

			this._loadingForm = false;
			this.initForm();
		}
	}

	private initForm(){
		this._formEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			description: new FormControl(this._Entity.description, [
				Validators.required,
				Validators.maxLength(500)
			])
		});
	}

	public submitForm() {
		if (this._formEntity.valid) {

			this._loading = true;

			let body = { ...this._formEntity.value, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt };

			if (this._idEntity) {
				// Edit Form
				this.api.put(this.entidad, body, this._idEntity).subscribe((resp: ApiResponse) => {
					this._loading = false;

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
		this.router.navigate(['admin/sectors']);
	}

	public close(){
		if(this._idEntity){
			this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
		}else{
			this.router.navigate(['../'], {relativeTo: this.activatedRoute});
		}
	}
}
