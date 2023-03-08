import { Component, OnInit } from '@angular/core';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { AppSettings } from '@services/settings';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-blog-list',
	templateUrl: './blog-list.component.html',
	styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

	public _loading: boolean;
	public _loadingInit: boolean;
	public _loadingPage: boolean;
	public _error: boolean;

	public _showConfirm: boolean;
	public _loadingConfirm: boolean;
	public _confirmMessage: string;

	public _EntityToDelete: any;

	public _result: ApiResponseRecords<any>;
	public _currentPage: number;
	public _ItemsPerPage: number;
	public _pagination: IPagination;
	public validFilterForm: any;
	public filterParams: any = null;
	public _loadingFilter: boolean;
	private FormFilter: FormGroup;
	
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api,
		private alert: DialogService
	) { }

	async ngOnInit() {
		this._loading = false;
		this._error = false;
		this._showConfirm = false;
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

	private async loadEntidades(params?: Object){
		try {
			let resp = await this.api.get(Entities.posts, null, this._currentPage, this._ItemsPerPage, params).toPromise() as ApiResponse;
			this._result = resp.response;

			this._pagination = {
				pages: Utilities.recordPages(this._result.pagesNumber),
				pagesNumber: this._result.pagesNumber,
				elementsNumber: this._result.elementsNumber,
				itemsPerPage: this._ItemsPerPage,
				currentPage: this._currentPage
			}

			if (!this._result.data.length && this._result.elementsNumber > 0) {
				if (this._currentPage != this._result.pagesNumber)
					this.goToPage({ pageNumber: this._result.pagesNumber });
				else{
					this._loadingInit = false;
					this._loadingPage = false;
				}
			} else {
				this._loadingInit = false;
				this._loadingPage = false;
			}
		} catch (err) {
			if(this._loadingInit)
				this._error = true;

			alert(err);

			this._loadingInit = false;
			this._loadingPage = false;
		}
	}

	public goToPage(event: any) {
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

	public delete(Entity: any) {
		this._confirmMessage = "¿Desea eliminar el blog " + Entity.name + "?";
		this._showConfirm = true;
		this._EntityToDelete = Entity;
	}

	public async confirm($event: Event){
		if($event){
			this._loadingConfirm = true;

			try {
				let resp = await this.api.delete(Entities.posts, this._EntityToDelete.id).toPromise() as ApiResponse;

				this.alert.success(resp.message);
				this.loadEntidades();

			} catch (err) {
				alert(err);
			}

			this._loadingConfirm = false;
			this._showConfirm = false;
		}
	}

	public viewDetail(item: any){
		this.router.navigate(['../../../blog-detail/detail', item.id], { relativeTo: this.activatedRoute }); 
	}

	public getUrlImage(images: any){
		if (images) {
			let imageObj = JSON.parse(images[0]);
			return imageObj.Location;
		}else{
			return 'assets/empty.jpg';
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