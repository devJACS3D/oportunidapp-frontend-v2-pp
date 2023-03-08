import { Component, OnInit } from '@angular/core';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { AppSettings } from '@services/settings';
import { Utilities } from '@utils/utilities';
import { Entities } from '@services/entities';

@Component({
	selector: 'app-user-tests',
	templateUrl: './user-tests.component.html',
	styleUrls: ['./user-tests.component.scss']
})
export class UserTestsComponent implements OnInit {

	public _loadingInit: boolean;
	public _error: string = '';


	public _result: any;

	constructor(
		private api: Api
	) { }

	async ngOnInit() {
		this._loadingInit = true;

		try {
			let resp = await this.api.get(Entities.userTests, ' ').toPromise() as ApiResponse;
			this._result = resp.response;
			console.log(this._result);
		} catch (err) {
			if (this._loadingInit)
				this._error = err;

			alert(err);

		}

		this._loadingInit = false;
	}

}
