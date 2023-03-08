import { Component, OnInit } from '@angular/core';
import { Entities } from '@services/entities';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IAdditionalService } from '@apptypes/entities/additional-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { AppSettings } from '@services/settings';
import { Utilities } from '@utils/utilities';
import { IPagination } from '@apptypes/pagination';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-additionals-services',
	templateUrl: './additionals-services.component.html',
	styleUrls: ['./additionals-services.component.scss']
})
export class AdditionalsServicesComponent implements OnInit {

	private entidad: string = Entities.additionalsServices;

	public _loading: boolean;
	public _loadingInit: boolean;
	public _loadingPage: boolean;
	public _error: any;

	public _showConfirm: boolean;
	public _loadingConfirm: boolean;
	public _confirmMessage: string;
	public _EntityToDelete: IAdditionalService;

	public _result: ApiResponseRecords<any>;
	public _currentPage: number;
	public _ItemsPerPage: number;
	public FormFilter: FormGroup;


	public _pagination: IPagination;
	public validFilterForm: any;
	public filterParams: any = null;
	public _loadingFilter: boolean;

	constructor(
		public router: Router,
		public activatedRoute: ActivatedRoute,
		public api: Api,
		public alert: DialogService
	) { }

	async ngOnInit() {
		this._loading = false;
		this._error = false;
		this._loadingInit = true;
		this._loadingPage = true;

		this._currentPage = this.activatedRoute.snapshot.params.page;
		this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

		if (!this._currentPage || !this._ItemsPerPage) {
			if (!this._currentPage)
				this.router.navigate([`./1/${ AppSettings.defaultItemsPerPage }`], { relativeTo: this.activatedRoute });
			else
				this.router.navigate([`../1/${ AppSettings.defaultItemsPerPage }`], { relativeTo: this.activatedRoute });
		} else {
			try {

				this.initForm();
				await this.loadEntidades();
			} catch (err) {
				this._error = err;
			}

			this._loadingInit = false;
		}
	}

	private loadEntidades(params?: Object){
		this.api.get(this.entidad, null, this._currentPage, this._ItemsPerPage, params).subscribe(
			(resp: ApiResponse) => {
				this._result = resp.response;
				
				this._pagination = {
					pages: Utilities.recordPages(this._result.pagesNumber),
					pagesNumber: this._result.pagesNumber,
					elementsNumber: this._result.elementsNumber,
					itemsPerPage: this._ItemsPerPage,
					currentPage: this._currentPage
				}

				if (!this._result.data.length && this._result.elementsNumber > 0) {
					this.goToPage({ pageNumber: this._result.pagesNumber });
				} else {
					this._loadingInit = false;
					this._loadingPage = false;
				}

			}, err => {
				if (this._loadingInit)
					this._error = true;
				else
					alert(err);

				this._loadingInit = false;
				this._loadingPage = false;
			}
		);
	}

	public goToPage(event) {
		if (event.direction)
			event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

		this._loadingPage = true;
		this._currentPage = event.pageNumber;
		this.loadEntidades();
		this.router.navigate(['./../../' + event.pageNumber + '/' + this._ItemsPerPage], { relativeTo: this.activatedRoute });
	}

	public closeConfirm($event){
		if($event){
			this._showConfirm = false;
		}
	}

	public delete(Entity: IAdditionalService) {
		this._confirmMessage = "¿Desea eliminar el servicio " + Entity.name + "?";
		this._showConfirm = true;
		this._EntityToDelete = Entity;
	}

	public confirm($event){
		if($event){
			this._loadingConfirm = true;
			this.api.delete(this.entidad, this._EntityToDelete.id).subscribe( (resp: ApiResponse) => {
				this._loadingConfirm = false;
				this._showConfirm = false;

				// alert(resp.message);
				this.alert.success(resp.message);
				this.loadEntidades();
			}, err =>{
				this._loadingConfirm = false;
				this._showConfirm = false;
				alert(err);
			});
		}
	}
	
	public async filter() {
		if (this.validFilterForm) {
			this.filterParams = this.checkValidForm();
			this._loadingFilter = true;
			this._loadingPage = true;

			try {
				this._currentPage = 1;
				let entityForm = JSON.parse(JSON.stringify(this.filterParams));
				await this.loadEntidades(entityForm);

			} catch (err) {
				this.alert.error(err);
			}

			this._loadingPage = false;
			this._loadingFilter = false;
		}
	}
	
	private initForm(){
		let filter = { search: '' };
		filter = (this.filterParams) ? this.filterParams : filter;

		this.FormFilter = new FormGroup({
			search: new FormControl(filter.search)
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
			await this.loadEntidades();
			Utilities.resetForm(this.FormFilter);
			this.filterParams = null;
		} catch (err) {
			this.alert.error(err);
		}

		this._loadingPage = false;
	}
}
