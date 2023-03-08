import { Component, OnInit } from '@angular/core';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { AppSettings } from '@services/settings';
import { Utilities } from '@utils/utilities';
import { LocalStorageService } from '@services/local-storage.service';
import { Entities } from '@services/entities';
import { IAlliance } from '@apptypes/entities/alliance';

@Component({
	selector: 'app-alliances-page',
	templateUrl: './alliances-page.component.html',
	styleUrls: ['./alliances-page.component.scss']
})
export class AlliancesPageComponent implements OnInit {

	public _loadingInit: boolean;
	public _loadingPage: boolean;
	public _error: string = '';

	public _result: ApiResponseRecords<any>;
	public _currentPage: number;
	public _ItemsPerPage: number;

	public _pagination: IPagination;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private storage: LocalStorageService
	) { }

	async ngOnInit() {
		this._loadingPage = false;
		this._loadingInit = true;

		this._currentPage = this.activatedRoute.snapshot.params.page;
		this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

		if (!this._currentPage || !this._ItemsPerPage) {
			if (!this._currentPage)
				this.router.navigate([`./1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
			else
				this.router.navigate([`../1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
		} else {
			try {
				
				await this.loadData();
			} catch (err) {
				this._error = err;
			}

			this._loadingInit = false;
		}
	}

	private loadData(params?: Object) {
		return new Promise(async (resolve, reject) => {
			try {
				let reqParams = (params) ? { ...params } : null;
				this.storage.setParams('Admin', Entities.vacancies, 'filterParams', params);

				let resp: ApiResponse = await this.api.get(Entities.alliances, null, this._currentPage, this._ItemsPerPage, reqParams).toPromise();
				this._result = resp.response;

				this.router.navigate(['./../../' + this._currentPage + '/' + this._ItemsPerPage], { relativeTo: this.activatedRoute });

				if (!this._result.data.length && this._result.elementsNumber > 0) {
					if (this._currentPage != this._result.pagesNumber) {
						this._currentPage = this._result.pagesNumber;

						await resolve(this.loadData());
					}
				}

				this._pagination = {
					pages: Utilities.recordPages(this._result.pagesNumber),
					pagesNumber: this._result.pagesNumber,
					elementsNumber: this._result.elementsNumber,
					itemsPerPage: this._ItemsPerPage,
					currentPage: this._currentPage
				}

				resolve(this._pagination);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async goToPage(event: any) {
		if (event.direction)
			event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

		this._loadingPage = true;
		this._currentPage = event.pageNumber;
		await this.loadData();
		this._loadingPage = false;
	}

	public viewDetail(alliance: IAlliance){
		this.router.navigate([`./home/alliances/${this._currentPage}/${this._ItemsPerPage}`]).then(resp =>{
			this.router.navigate([`./home/alliances/${this._currentPage}/${this._ItemsPerPage}/detail-alliance`, alliance.id]);
			document.documentElement.scrollTop = 0;
		});
	}
}
