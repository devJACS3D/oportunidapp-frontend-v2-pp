import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { IPost } from '@apptypes/entities/post';
import { Entities } from '@services/entities';
import { DialogService } from '../dialog-alert/dialog.service';
import { ApiResponse } from '@apptypes/api-response';
import { FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
	selector: 'app-detail-blogs',
	templateUrl: './detail-blogs.component.html',
	styleUrls: ['./detail-blogs.component.scss']
})
export class DetailBlogsComponent implements OnInit {

	public _loadingInit: boolean;

	private _idEntity: number;
	public _Entity: IPost;
	public _loadError: string;
	currentUser: any;
	comments: any;

	_formEntity: FormGroup;
	img_profile: string;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	async ngOnInit() {
		console.log('onInit() detail');
		this.currentUser = this.api.getCurrentUser();

		this.img_profile = 'https://oportunidapp-data.s3.amazonaws.com/profilePicture/profilePicture-2019-12-13T21%3A22%3A23%2B00%3A00-a74ff932f8c0333fcb3f2a1794e2663c.jpg'

		this.initForm();
		//this.getComemtsById();

		this._loadingInit = true;
		this._loadError = '';

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;

			if (this._idEntity && !isNaN(this._idEntity)) {
				let resp = await this.api.get(Entities.posts, this._idEntity).toPromise();
				this._Entity = resp.response.registerDetails;
				this._Entity.images = JSON.parse(this._Entity.images[0]);

				console.log(this._Entity);

			} else {
				this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
			}
		} catch (err) {
			console.log('error loading detail-blogs: ', err);
			this._loadError = err;
		}


		this._loadingInit = false;
	}

	private initForm() {
		this._formEntity = new FormGroup({
			description: new FormControl('', [
				Validators.required,
				Validators.maxLength(500)
			])
		});
	}


	public share(shareOn: string, e: Event) {
		e.preventDefault();

		var spec = 'width=600,height=350,top=50,left=100';

		if (shareOn == 'facebook') {
			var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', spec);
			if (facebookWindow.focus) { facebookWindow.focus(); }
		}

		if (shareOn == 'twitter') {
			var twitterWindow = window.open('https://twitter.com/share?url=' + document.URL, 'twitter-popup', spec);
			if (twitterWindow.focus) { twitterWindow.focus(); }
		}

	}

	public goBack() {
		console.log('goBack');

		if (this.router.url.toString().includes('home/')) {
			this.router.navigate(['home/blogs']);

		} else {
			this.router.navigate(['business/blogs']);
		}
	}
	/**
	 * Obtener comentarios por id de post
	 */
	async getComemtsById() {
		// posts/3/comments
		let resp: any;
		resp = await this.api.get('posts/' + this.activatedRoute.snapshot.params.id + '/comments', null, 1, 1000).toPromise();
		this.comments = resp.comments;

		console.log('cgetComemtsById', this.comments);


	}
	/**
	 * Crear comentario por post
	 */
	createComent() {
		if (!this.currentUser) {
			// (blogs/1/9//modal:login)
			this.alert.error('Debes iniciar sesion para comentar');
			if (this.router.url.toString().includes('home/')) {
				// this.router.navigate(['home/(blogs/1/9//modal:login)']);

			} else {
				// this.router.navigate(['business/(blogs/1/9//modal:login)']);
			}
		} else {

			let entity;
			let body;

			body = { ... this._formEntity.value, postId: this._idEntity, userId: this.currentUser.id }
			console.log(body);

			entity = 'posts/comment';
			if (this._formEntity.valid) {
				this.api.post(entity, body).subscribe((resp: ApiResponse) => {
					this.alert.success('Comentario Creado');
					///recargar post
					this._formEntity.reset;
					this.getComemtsById();
				}, err => {
					// alert(err);
					this.alert.error(err);
				});
			} else {
				console.log('form invalid');
			}
		}
	}
}
