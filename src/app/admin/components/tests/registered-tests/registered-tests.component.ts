import { Component, OnInit } from '@angular/core';
import { IPagination } from '@apptypes/pagination';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { ITest } from '@apptypes/entities/test';
import { Utilities } from '@utils/utilities';
import { AppSettings } from '@services/settings';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { FormGroup, FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-registered-tests',
	templateUrl: './registered-tests.component.html',
	styleUrls: ['./registered-tests.component.scss']
})
export class RegisteredTestsComponent implements OnInit {
	public utils = Utilities;
	public tableHeaders = ['Nombre', 'Descripción general', 'Sector','Competencias y/o habilidades']
	private _tests: ITest[];
	//pagination
	filterParams: Object;
	private _pagination: IPagination;
	public currentPage: number = 1;
	public loadingPage: boolean;
	public itemsPerPage: number = 10;
	//delete options
	showDeleteOpts: boolean;
	deleteText: string;
	selectedSkill: ITest;
	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _api: Api,
		private _alert: DialogService
	) { }

	async ngOnInit() {
		this._activatedRoute.data.pipe(
			map((res) => res.tests)
		).subscribe((data: ApiResponseRecords<ITest>) => {
			this.tests = data.data ? data.data : [];
			this.pagination = data;
		});
	}
	set tests(tests: ITest[]) {
		this._tests = tests;
	}
	set pagination(pagination) {
		this._pagination = {
			pages: Utilities.recordPages(pagination.pagesNumber),
			pagesNumber: pagination.pagesNumber,
			elementsNumber: pagination.elementsNumber,
			itemsPerPage: this.itemsPerPage,
			currentPage: this.currentPage
		}
	}
	get tests(): ITest[] {
		return this._tests;
	}
	get pagination(): any {
		return this._pagination;
	}

	private async fetchData(filters?: Object) {
		this.loadingPage = true;
		try {
			let data: ApiResponse = await this._api.get(Entities.tests, null, this.currentPage, this.itemsPerPage, filters).toPromise();
			this.tests = data.response.data;
			this.pagination = data.response;
			/*  this._error = null; */
		} catch (error) {
			console.log(error);
			/*  this._error = error; */
		} finally {
			this.loadingPage = false;
		}
	}

	public async goToPage(event: any) {
		if (event.direction)
			event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

		this.currentPage = event.pageNumber;
		this.itemsPerPage = event.itemsPerPage;
		this.fetchData(this.filterParams);
	}

	public async onDeleteClose($event, justClose: boolean) {

		if (justClose) {
			this.showDeleteOpts = false;
			this.selectedSkill = null;
			return;
		}
		try {
			let resp = await this._api.delete(Entities.tests, this.selectedSkill.id).toPromise() as ApiResponse;
			this.fetchData();
			this._alert.success(resp.message);
		} catch (err) {
			this._alert.error(err);
		} finally {
			this.showDeleteOpts = false;
			this.selectedSkill = null;
		}

	}
	public delete(test: ITest) {
		this.deleteText = `¿Desea eliminar la prueba ${test.name}?`;
		this.showDeleteOpts = true;
		this.selectedSkill = test;
	}

	public applyFilters(filter) {
		this.currentPage = 1;
		this.filterParams = filter;
		this.fetchData(this.filterParams);
	}

	createTest() {
		this._router.navigate(['./create'], { relativeTo: this._activatedRoute });
	}

}
