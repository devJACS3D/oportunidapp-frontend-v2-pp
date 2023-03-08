import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { image } from '@apptypes/image';
import { Location } from '@angular/common';

@Component({
	selector: 'app-success-story-detail',
	templateUrl: './success-story-detail.component.html',
	styleUrls: ['./success-story-detail.component.scss']
})
export class SuccessStoryDetailComponent implements OnInit {

	public _loadingInit: boolean;
	public _error: string = '';

	public _idEntity: number;
	public  _Entity: any;
	public _storyImage: image = {};

	constructor(
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api
	) { }

	async ngOnInit() {
		this._loadingInit = true;

		this._storyImage.Url = 'assets/empty.jpg';

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;
			let response = await this.api.get(Entities.successStories, this._idEntity).toPromise() as ApiResponse;
			this._Entity = response.response.registerDetails;

			if (this._Entity.images) {
				let imageObj = JSON.parse(this._Entity.images[0]);
				this._storyImage.Url = imageObj.Location;
			}

		} catch (err) {
			this._error = err;
		}

		this._loadingInit = false;
	}

	public getUrlImage(images: any){
		if (images) {
			let imageObj = JSON.parse(images[0]);
			return imageObj.Location;
		}else{
			return 'assets/empty.jpg';
		}
	}

	public goBack(){
		this.location.back();
	}

}
