import { Component, OnInit } from '@angular/core';
import { IVacancy } from '@apptypes/entities/vacancy';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { AppSettings } from '@services/settings';
import { LocalStorageService } from '@services/local-storage.service';
import { Utilities } from '@utils/utilities';
import { FormGroup, FormControl } from '@angular/forms';
import { IState } from '@apptypes/entities/state';
import { ICity } from '@apptypes/entities/city';
import { ISector } from '@apptypes/entities/sector';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { RegexUtils } from '@utils/regex-utils';

@Component({
	selector: 'app-vacantes',
	templateUrl: './vacantes.component.html',
	styleUrls: ['./vacantes.component.scss']
})
export class VacantesComponent implements OnInit {

	arrayOne(n: number): any[] {
		return Array(n);
	}

	public maskCurrency: RegExp = RegexUtils._maskCurrency;

	public _loadingInit: boolean;
	public _loadingPage: boolean;
	public _error: string = '';


	public _cardView: boolean = true;
	public _vacancies: IVacancy[];

	public _result: ApiResponseRecords<any>;
	public _currentPage: number;
	public _ItemsPerPage: number;
	public _pagination: IPagination;

	public _loadingCities: boolean;
	public _states: IState[] = [];
	public _cities: ICity[] = [];
	public _sectors: ISector[] = [];

	public _loadingFilter: boolean;
	private FormFilter: FormGroup;
	public _filterForm: boolean = false; // Show or hide filterForm
	public validFilterForm: boolean;
	private filterParams: any = null;
	public _maxDate: any;

	constructor(
		private api: Api,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private storage: LocalStorageService,
		private alert: DialogService
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
				let stateResp = await this.api.get(Entities.states, null, 1, 1000).toPromise();
				this._states = stateResp.response.data;

				let secResp = await this.api.get(Entities.sectors, null, 1, 1000).toPromise();
				this._sectors = secResp.response.data;

				this.filterParams = this.storage.getParams('user', Entities.vacancies, 'filterParams');
				this.initForm();

				await this.loadData();
	
			} catch (err) {
				this._error = err;
			}

			this._loadingInit = false;
		}
	}

	public viewDetail(item: IVacancy) {
		console.log('viewDetail');

		if (this.router.url.toString().includes('vacantes/')) {
			this.router.navigate(['detail-vacancy/', item.id], { relativeTo: this.activatedRoute });

		} else {
			this.router.navigate(['../../../detail-vacancy/', item.id], { relativeTo: this.activatedRoute });

		}
	}

	private loadData(params?: Object) {
		return new Promise(async (resolve, reject) => {
			try {
				let reqParams:any = (params) ? { ...params,published:1 } : {published:1};
				this.storage.setParams('user', Entities.vacancies, 'filterParams', params);
				console.log(this._cities)
				if (reqParams != null && reqParams.cityId == undefined && this._cities.length !== 0 ) {
					console.log('here')
					let cityId = this._cities[0]
					reqParams.cityId = cityId.id ;
					let resp: ApiResponse = await this.api.get(Entities.vacancies, null, this._currentPage, this._ItemsPerPage, reqParams).toPromise();
					this._result = resp.response;
					for (let i = 1; i < this._cities.length; i++) {
						const city = this._cities[i].id;
						reqParams.cityId = city;
						let resp: ApiResponse = await this.api.get(Entities.vacancies, null, this._currentPage, this._ItemsPerPage, reqParams).toPromise();
						for (let j = 0; j < resp.response.data.length; j++) {
							const cityj = resp.response.data[j];
							this._result.data.push(cityj);
						}
					}
					
				}else{
					let resp: ApiResponse = await this.api.get(Entities.vacancies, null, this._currentPage, this._ItemsPerPage, reqParams).toPromise();
					this._result = resp.response;
				}
				this.router.navigate(['./../../', this._currentPage, this._ItemsPerPage], { relativeTo: this.activatedRoute });

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
		await this.loadData(this.filterParams);
		this._loadingPage = false;
	}

	public async filter() {
		if (this.validFilterForm) {
			this.filterParams = this.checkValidForm();
			this._loadingFilter = true;
			this._loadingPage = true;

			try {
				this._currentPage = 1;

				let entityForm = JSON.parse(JSON.stringify(this.filterParams));
				if (entityForm.salary) entityForm.salary = RegexUtils._unMaskCurrency(entityForm.salary) //Establece el valor como númerico.
				if (entityForm.date) entityForm.date = Utilities.unixToDate(Utilities.unformatDate(entityForm.date));

				await this.loadData(entityForm);
				this._filterForm = false; // Ocultar panel de filtreo
			} catch (err) {
				this.alert.error(err);
			}

			this._loadingPage = false;
			this._loadingFilter = false;
		}
	}

	private initForm() {
		let filter = { vacanciesNameSearch: '', stateId: '', cityId: '', salary: '', sectorsNameSearch: '', date: '' };
		filter = (this.filterParams) ? this.filterParams : filter;

		this.FormFilter = new FormGroup({
			vacanciesNameSearch: new FormControl(filter.vacanciesNameSearch || ''),
			stateId: new FormControl(filter.stateId || ''),
			cityId: new FormControl(filter.cityId || ''),
			salary: new FormControl(filter.salary || ''),
			sectorsNameSearch: new FormControl(filter.sectorsNameSearch || ''),
			date: new FormControl(filter.date || '')
		});

		this.FormFilter.valueChanges.subscribe(() => {
			this.checkValidForm();
		});
	}

	private checkValidForm() {
		let body = this.FormFilter.value;
		let filterParams = {};
		for (let i in body) {
			if (body[i]) filterParams[i] = body[i];
		}
		this.validFilterForm = (Object.keys(filterParams).length) ? true : false;
		return filterParams;
	}

	public async clearFilter() {
		this._loadingPage = true;

		try {
			await this.loadData();
			Utilities.resetForm(this.FormFilter);
			this.filterParams = null;
		} catch (err) {
			this.alert.error(err);
		}

		this._loadingPage = false;
	}

	public async changeDepartment(event: any) {
		const departmentID = event.target.value;
		this._cities = [];
		this.FormFilter.controls.cityId.setValue("");

		if (departmentID != '' && departmentID != null && departmentID != undefined) {
			this._loadingCities = true;

			let citiesResp = await this.api.get(Entities.cities, null, 1, 1000, { stateId: departmentID }).toPromise();
			this._cities = citiesResp.response.data;
			this._loadingCities = false;
		}
	}

	public getUrlImage(images: any) {
		if (images) {
			let imageObj = JSON.parse(images[0]);
			return imageObj.Location;
		} else {
			return 'assets/empty.jpg';
		}
	}
}
