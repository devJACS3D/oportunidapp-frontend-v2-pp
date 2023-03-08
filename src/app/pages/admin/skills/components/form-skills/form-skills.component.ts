import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { ISkill } from '@entities/skill';
import { ApiResponse } from '@apptypes/api-response';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
	selector: 'app-form-skills',
	templateUrl: './form-skills.component.html',
	styleUrls: ['./form-skills.component.scss']
})
export class FormSkillsComponent implements OnInit {

	private entidad: string = Entities.skills;

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;

	public _formEntity: FormGroup;
	private _idEntity: number;
	public _Entity: ISkill;

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
			this._title = 'Editar competencias y/o habilidades';
			this._btnText = 'Actualizar';

			this.api.get(this.entidad, this._idEntity).subscribe((resp: ApiResponse) => {
				this._loadingForm = false;
				this._Entity = resp.response.registerDetails;

				this.initForm();
			}, err => {
				this._loadingForm = false;
				alert(err);
			});

		} else {
			// Create Form
			this._title = 'Crear competencias y/o habilidades';
			this._btnText = 'Crear';

			this._Entity = {
				name: ''
			}

			this._loadingForm = false;
			this.initForm();
		}
	}

	private initForm() {
		this._formEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			])
		});
	}


	public submitForm() {
		if (this._formEntity.valid) {

			this._loading = true;

			let body = { ...this._formEntity.value, createdAt: this._Entity.createdAt, updatedAt: this._Entity.updatedAt, deletedAt: this._Entity.deletedAt, behaviors: [] };

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
					// alert(err);
				});
			}

		} else {
			alert('Campos vacios o inválidos. Por favor complete información correctamente.');
		}
	}

	public back() {
		this.router.navigate(['admin/skills/list']);
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../list'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
		}
	}
}
