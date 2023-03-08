import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';
import { ISuccessStory } from '@apptypes/entities/success-story';
import { image } from '@apptypes/image';

@Component({
	selector: 'app-form-success-stories',
	templateUrl: './form-success-stories.component.html',
	styleUrls: ['./form-success-stories.component.scss']
})
export class FormSuccessStoriesComponent implements OnInit {

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;
	public _showError: boolean = false;
	public _error: string = '';

	public FormEntity: FormGroup;
	private _idEntity: number;
	public _Entity: ISuccessStory;

	public _storyImage: image = {};

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	async ngOnInit() {
		this._loading = false;
		this._loadingForm = true;

		this._storyImage.Url = 'assets/empty.jpg';

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;
			if (this._idEntity) {
				let resp = await this.api.get(Entities.successStories, this._idEntity).toPromise();
				this._Entity = resp.response.registerDetails;

				if (this._Entity.images) {
					let imageObj = JSON.parse(this._Entity.images[0]);
					this._storyImage.Url = imageObj.Location;
				}

				this._btnText = 'Actualizar';
				this._title = 'Actualizar caso de éxito';

			} else {
				this._btnText = 'Guardar';
				this._title = 'Crear caso de éxito';
				this._Entity = {
					name: '',
					rol: '',
					comment: '',
					video: ''
				}
			}

			this.initForm();


		} catch (err) {
			this._error = err;
		}

		this._loadingForm = false;

		if (this._idEntity) {
			console.log('changeEmbed 1');
			await Utilities.sleep(200);
			this.changeEmbed();
			console.log('changeEmbed 2');
		}
	}

	private initForm() {
		this.FormEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			rol: new FormControl(this._Entity.rol, [
				Validators.required
			]),
			comment: new FormControl(this._Entity.comment, [
				Validators.required,
				Validators.maxLength(250)
			]),
			video: new FormControl(this._Entity.video, [
				// Validators.required
				Validators.maxLength(2000)
			])
		});
	}

	public async save() {
		try {
			let entityForm: any = this.FormEntity.value;
			let formData = Utilities.getFormData(entityForm);
			let saveResponse: ApiResponse;

			if (this._idEntity) {
				// Editar Registro

				if (this.FormEntity.valid) {
					this._loading = true;

					if (this._storyImage.Data)
						formData.append('images', this._storyImage.Data);

					saveResponse = await this.api.putData(Entities.successStories, formData, this._idEntity).toPromise() as ApiResponse;

					this.alert.success(saveResponse.message);
					this.back();

				} else {
					Utilities.markAsDirty(this.FormEntity);
					this._showError = true;
				}

			} else {
				// Crear registro
				if (this.FormEntity.valid && this._storyImage.Data) {
					this._loading = true;
					formData.append('images', this._storyImage.Data);

					saveResponse = await this.api.postData(Entities.successStories, formData).toPromise() as ApiResponse;

					this.alert.success(saveResponse.message);
					this.back();
				} else {
					Utilities.markAsDirty(this.FormEntity);
					this._showError = true;
				}

			}

		} catch (err) {
			alert(err);
		}

		this._loading = false;
	}

	public changeEmbed() {
		console.log('changeEmbed() in');
		// let strHtml: string = event.target.value;
		let strHtml: string = this.FormEntity.controls.video.value;
		let objHtml = document.createElement('div');
		objHtml.innerHTML = strHtml;
		let iframe = objHtml.firstElementChild;
		iframe.removeAttribute('height');
		iframe.removeAttribute('width');
		iframe.setAttribute('width', '100%');

		document.querySelector('.embedVideo').innerHTML = '';
		document.querySelector('.embedVideo').appendChild(iframe);

		// event.target.value = document.querySelector('.embedVideo').innerHTML;
		this.FormEntity.controls.video.setValue(document.querySelector('.embedVideo').innerHTML);
	}

	public back() {
		this.router.navigate(['admin/success-stories']);
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute });
		}
	}

	public onInputImageChange(e) {
		this._storyImage.Name = e.target.value;
		this._storyImage.Data = e.target.files[0];
		this.getImage(this._storyImage.Data);
	}

	public getImage(file: any) {
		let reader: FileReader = new FileReader();
		if (file.type.startsWith('image')) {
			reader.onload = (e) => {
				let url = reader.result;
				this._storyImage.Url = url;
			}
			reader.readAsDataURL(file);
		} else {
			alert('¡Sólo se admiten imágenes!');
		}
	}

}