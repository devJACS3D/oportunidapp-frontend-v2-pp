import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPost } from '@apptypes/entities/post';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { ApiResponse } from '@apptypes/api-response';
import { image } from '@apptypes/image';

@Component({
	selector: 'app-form-blogs',
	templateUrl: './form-blogs.component.html',
	styleUrls: ['./form-blogs.component.scss']
})
export class FormBlogsComponent implements OnInit {

	public _title: string;
	public _btnText: string;

	public _loading: boolean;
	public _loadingForm: boolean;
	public _showError: boolean = false;
	public _error: string = '';

	public FormEntity: FormGroup;
	private _idEntity: number;
	public _Entity: IPost;

	public _postImage: image = {};

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	async ngOnInit() {
		this._loading = false;
		this._loadingForm = true;

		this._postImage.Url = 'assets/empty.jpg';

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;

			if (this._idEntity) {
				let resp = await this.api.get(Entities.posts, this._idEntity).toPromise();
				this._Entity = resp.response.registerDetails;

				if (this._Entity.images) {
					let imageObj = JSON.parse(this._Entity.images[0]);
					this._postImage.Url = imageObj.Location;
				}

				this._btnText = 'Actualizar';
				this._title = 'Actualizar blog';
			} else {
				this._btnText = 'Guardar';
				this._title = 'Crear blog';

				this._Entity = {
					name: '',
					author: '',
					description: '',
					aboutAuthor: ''
				}
			}

			this.initForm();


		} catch (err) {
			this._error = err;
		}

		this._loadingForm = false;
	}

	private initForm() {
		this.FormEntity = new FormGroup({
			name: new FormControl(this._Entity.name, [
				Validators.required,
				Validators.maxLength(100)
			]),
			author: new FormControl(this._Entity.author, [
				Validators.required,
				Validators.maxLength(100)
			]),
			description: new FormControl(this._Entity.description, [
				Validators.required,
				Validators.maxLength(3000)
			]),
			aboutAuthor: new FormControl(this._Entity.aboutAuthor, [
				Validators.required,
				Validators.maxLength(250)
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

					if (this._postImage.Data)
						formData.append('images', this._postImage.Data);

					saveResponse = await this.api.putData(Entities.posts, formData, this._idEntity).toPromise() as ApiResponse;

					this.alert.success(saveResponse.message);
					this.back();

				} else {
					Utilities.markAsDirty(this.FormEntity);
					this._showError = true;
				}

			} else {
				// Crear registro
				if (this.FormEntity.valid && this._postImage.Data) {
					this._loading = true;
					formData.append('images', this._postImage.Data);

					saveResponse = await this.api.postData(Entities.posts, formData).toPromise() as ApiResponse;

					this.alert.success(saveResponse.message);
					this.back();
				} else {
					Utilities.markAsDirty(this.FormEntity);
					this._showError = true;
				}

			}

		} catch (err) {
			// alert(err);
			this.alert.error(err);
		}

		this._loading = false;
	}

	public back() {
		this.router.navigate(['admin/blogs']);
	}

	public close() {
		if (this._idEntity) {
			this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
		} else {
			this.router.navigate(['../'], { relativeTo: this.activatedRoute });
		}
	}

	public onInputImageChange(event) {
		let file = event.target.files[0];
		let fileName = event.target.value;

		let reader: FileReader = new FileReader();
		if (file.type.startsWith('image')) {
			reader.onload = (e) => {
				let url = reader.result;
				this._postImage = {
					Url: url,
					Name: fileName,
					Data: file
				}
			}
			reader.readAsDataURL(file);
		} else {
			// alert('¡Sólo se admiten imágenes!');
			this.alert.error('¡Sólo se admiten imágenes!');
		}
	}

	// public onInputImageChange(e) {
	// 	this._postImage.Name = e.target.value;
	// 	this._postImage.Data = e.target.files[0];
	// 	this.getImage(this._postImage.Data);
	// }

	// public getImage(file: any) {
	// 	let reader: FileReader = new FileReader();
	// 	if (file.type.startsWith('image')) {
	// 		reader.onload = (e) => {
	// 			let url = reader.result;
	// 			this._postImage.Url = url;
	// 		}
	// 		reader.readAsDataURL(file);
	// 	} else {
	// 		alert('¡Sólo se admiten imágenes!');
	// 	}
	// }

}
