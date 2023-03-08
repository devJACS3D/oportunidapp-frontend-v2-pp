import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IVacancy } from '@apptypes/entities/vacancy';

@Component({
	selector: 'app-card-vacancy',
	templateUrl: './card-vacancy.component.html',
	styleUrls: ['./card-vacancy.component.scss']
})
export class CardVacancyComponent implements OnInit {

	@Input('vacancy') item: IVacancy;
	@Output() viewDetail: EventEmitter<any> = new EventEmitter<any>();

	public urlImage: string;

	constructor() { }

	ngOnInit() {
		if(this.item){
			this.urlImage = (this.item.images)? JSON.parse(this.item.images[0]).Location : 'assets/empty.jpg';
		}
	}

	public goToDetail(item: IVacancy){
		this.viewDetail.emit(item);
	}
}
