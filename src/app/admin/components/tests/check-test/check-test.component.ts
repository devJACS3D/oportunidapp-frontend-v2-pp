import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Entities } from '@services/entities';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-check-test',
	templateUrl: './check-test.component.html',
	styleUrls: ['./check-test.component.scss']
})
export class CheckTestComponent implements OnInit {

	public viewState: number;
	public _approved: boolean;
	public _comment: string;
	public _loadingComment: boolean;

	private vacancyApplicationId: number;

	constructor(
		private api: Api,
		private alert: DialogService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.viewState = 1;
		this._approved = false;
		this._loadingComment = false;

		this.vacancyApplicationId = this.activatedRoute.snapshot.params.id;
	}

	public async checkTest(){
		if(this._comment){
			this._loadingComment = true;

			try {
				let approved: string = (this._approved) ? '2' : '1';
				let body = { applicationStatus: approved, psychologistCommentInTest: this._comment };

				let resp = await this.api.put(Entities.vacancyApplications, body, this.vacancyApplicationId).toPromise();
				this.back();
				this.alert.success(resp.message);

			} catch (err) {
				this.alert.error(err);
			}

			this._loadingComment = false;
		}
	}

	private back(){
		this.router.navigate(['admin/tests']).then(() => {
			this.router.navigate(['admin/tests/finished']);
		});
	}

}
