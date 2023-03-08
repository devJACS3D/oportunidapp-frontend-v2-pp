import { Component, OnInit } from '@angular/core';
import { IAlliance } from '@apptypes/entities/alliance';
import { Api } from '@utils/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';

@Component({
	selector: 'app-alliances-section',
	templateUrl: './alliances-section.component.html',
	styleUrls: ['./alliances-section.component.scss']
})
export class AlliancesSectionComponent implements OnInit {

	public _loadingInit: boolean;
	public _error: string = '';

	public _alliances: IAlliance[]

	constructor(
		private api: Api,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit() {
		this._loadingInit = true;
		try {
			let resp = await this.api.get(Entities.alliances, null, 1, 6).toPromise() as ApiResponse;
			this._alliances = resp.response.data;

		} catch (err) {
			this._error = err;
		}
		this._loadingInit = false;
	}

	public viewDetail(item: IAlliance){
		
	}

}
