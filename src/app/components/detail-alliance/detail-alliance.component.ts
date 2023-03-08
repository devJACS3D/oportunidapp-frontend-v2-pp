import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IAlliance } from '@apptypes/entities/alliance';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { Utilities } from '@utils/utilities';

@Component({
	selector: 'app-detail-alliance',
	templateUrl: './detail-alliance.component.html',
	styleUrls: ['./detail-alliance.component.scss']
})
export class DetailAllianceComponent implements OnInit {

	public _loadingInit: boolean;
	public _error: string = '';

	private _idEntity: number;
	public _Entity: IAlliance;

	public urlImage: string = '';

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api
	) { }

	async ngOnInit() {
		this._loadingInit = true;

		this.urlImage = 'assets/empty.jpg';

		try {
			this._idEntity = this.activatedRoute.snapshot.params.id;

			// let resp = await this.api.get(Entities.alliances, this._idEntity).toPromise() as ApiResponse;
			// this._Entity = resp.response.registerDetails;
			let resp = await this.api.get(Entities.alliances, null, 1, 8).toPromise() as ApiResponse;
			this._Entity = resp.response.data[0];

			if(this._Entity.images){
				console.log(' Entity', JSON.parse(this._Entity.images[0]));
				this.urlImage = JSON.parse(this._Entity.images[0]).Location;
			}
				
			
			

			this.loadVideo(this._Entity.video);

		} catch (err) {
			this._error = '';
		}

		this._loadingInit = false;
	}


	private loadVideo(strIframe: string) {
		let strHtml: string = strIframe;
		let objHtml = document.createElement('div');
		objHtml.innerHTML = strHtml;
		let iframe = objHtml.firstElementChild;
		iframe.removeAttribute('height');
		iframe.removeAttribute('width');
		iframe.setAttribute('width', '100%');
		iframe.setAttribute('height', '100%');

		document.querySelector('.embedVideo').innerHTML = '';
		document.querySelector('.embedVideo').appendChild(iframe);
	}
}
