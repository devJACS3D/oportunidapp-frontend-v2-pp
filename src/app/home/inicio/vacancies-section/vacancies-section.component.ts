import { Component, OnInit } from '@angular/core';
import { IVacancy } from '@apptypes/entities/vacancy';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-vacancies-section',
	templateUrl: './vacancies-section.component.html',
	styleUrls: ['./vacancies-section.component.scss']
})
export class VacanciesSectionComponent implements OnInit {

	arrayOne(n: number): any[] {
		return Array(n);
	}

	public _loadingInit: boolean;
	public _error: string = '';

	public _vacancies: IVacancy[];

	constructor(
		private api: Api,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit() {
		this._loadingInit = true;

		// this.router.events.subscribe(event => {
			//this.getVacancies()
			// console.log(event)
		// });

		this.getVacancies()

		this._loadingInit = false;
	}

	public async getVacancies(){
		// console.log("entra")
		try {
			// console.log(localStorage.getItem("current_user"))
			let user = JSON.parse(localStorage.getItem("current_user"))
			let companyId = user ? user.credentialCompanyId : null

			if(companyId){
				let resp = await this.api.get(Entities.vacancies, null, 1, 6, 
					{companyId: companyId,published:1}
				).toPromise();
				
				this._vacancies = resp.response.data;
			}else{
				let resp = await this.api.get(Entities.vacancies, null, 1, 6,{published:1}).toPromise();
				this._vacancies = resp.response.data;
			}

		} catch (err) {
			this._error = err;
			console.error('ngOnInit: ', err);
		}
	}

	public viewDetail(item: IVacancy){
		this.router.navigate(['./detail-vacancy/', item.id], { relativeTo: this.activatedRoute });
	}

}
