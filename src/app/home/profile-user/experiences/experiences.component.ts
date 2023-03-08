import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@apptypes/api-response';
import { IPagination } from '@apptypes/pagination';
import { Api } from '@utils/api';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';
import { IFilterValues } from '@apptypes/entities/IFilter';
import { ModalService } from 'src/app/components/modal/modal.service';
import { FormExperiencesComponent } from './form-experiences/form-experiences.component';
import { COLORS } from 'src/app/constants/constants';

@Component({
	selector: 'app-experiences',
	templateUrl: './experiences.component.html',
	styleUrls: ['./experiences.component.scss']
})
export class ExperiencesComponent implements OnInit {
	public pagination: IPagination;
	public filterParams: IFilterValues = {};
	public _error: boolean;
	public loadingPage: boolean;
	public currentPage: number = 1;
	public itemsPerPage: number = 10;
	public experiencies: any[] = []

	constructor(
		private api: Api,
		private alert: DialogService,
		private modalService: ModalService,
	) { }

	async ngOnInit() {
		await this.fetchData(this.filterParams);
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public async fetchData(params?: Object) {
		this.loadingPage = true;
		try {
			let paginatedResponse: ApiResponse = await this.api.get(Entities.userExperiences, null, this.currentPage, this.itemsPerPage, params).toPromise();
			this.experiencies = paginatedResponse.response.data;
			this.pagination = {
				pages: Utilities.recordPages(paginatedResponse.response.pagesNumber),
				pagesNumber: paginatedResponse.response.pagesNumber,
				elementsNumber: paginatedResponse.response.elementsNumber,
				itemsPerPage: this.itemsPerPage,
				currentPage: this.currentPage
			}
			this._error = null;
		} catch (error) {
			// console.log(error);
			this._error = error;
		} finally {
			this.loadingPage = false;
		}
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	formBuilderExperiencies(data?: any) {
		let payload = [
			'company', 'employment', 'startDate',
			'finishDate', 'functions', 'reasonWithdrawal',
			'boss', 'cellphone', 'cea', 'cl'
		].reduce((r, i) => { r[i] = null; return r }, {})
		payload['currentlyWorkHere'] = false
		payload['isInProcess'] = false
		if (data)
			payload = Object.assign(payload, data);
		const modal = this.modalService.create(FormExperiencesComponent, { data: payload });
		modal.afterDestroy$.subscribe(res => {
			if (res.refresh) {
				this.fetchData(this.filterParams)
			}
			if (res.experiencie) {
				if (data.id === res.experiencie.id) {
					data.cea = null
				}
			}
		});
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public onClickAdd(open: boolean) {
		if (open) {
			this.formBuilderExperiencies()
		}
	}
	/*------------------------------------------------------------------------------------------------------------------------
		  
	--------------------------------------------------------------------------------------------------------------------------*/
	public onClickEdit(experiencie: any) {
		if (experiencie) {
			this.formBuilderExperiencies(experiencie)
		}
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public onClickRemove(experiencie: any) {
		if (experiencie) {
			this.deleteModal(experiencie)
		}
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	async deleteModal(experiencie: any) {
		const ref = this;
		this.alert.customAlert({
			title: `¿Desea eliminar la experiencia ${experiencie.employment}?`,
			bgColor: COLORS.DANGER,
			bgBottom: true,
			closeButton: true,
			buttons: [
				{
					name: 'Eliminar',
					onClick: function () {
						ref.alert.loadingAlert(this, true);
						ref.delete(experiencie.id, this)
					}
				}
			]
		})
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	private delete(id: number, refModal) {
		this.api.delete(Entities.userExperiences, id).subscribe(async res => {
			this.alert.closeAlert();
			await this.fetchData(this.filterParams);
			this.successAlert(res.message);
		}, (error) => this.errorAlert(error), () => {
			this.alert.loadingAlert(refModal, false);
		});
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	public async goToPage(event: any) {
		if (event.direction)
			event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());
		this.itemsPerPage = event.itemsPerPage;
		this.currentPage = event.pageNumber;
		await this.fetchData(this.filterParams);
	}
	/*------------------------------------------------------------------------------------------------------------------------
	  
	--------------------------------------------------------------------------------------------------------------------------*/
	successAlert(message: string) {
		this.alert.customAlert({
			message,
			bgColor: COLORS.SUCCESS,
			icon: COLORS.SUCCESS,
			bgBottom: true,
			autoClose: true
		})
	}
	errorAlert(message: string) {
		this.alert.customAlert({
			message,
			bgColor: COLORS.DANGER,
			icon: COLORS.WARNING,
			bgTop: true,
			autoClose: true
		})
	}
}
