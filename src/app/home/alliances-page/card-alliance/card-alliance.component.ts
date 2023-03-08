import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAlliance } from '@apptypes/entities/alliance';

@Component({
	selector: 'app-card-alliance',
	templateUrl: './card-alliance.component.html',
	styleUrls: ['./card-alliance.component.scss']
})
export class CardAllianceComponent implements OnInit {
	@Input('alliance') item: IAlliance;
	@Output() viewDetail: EventEmitter<any> = new EventEmitter<any>();

	public urlImage: string;

	constructor() { }

	ngOnInit() {
		this.urlImage = (this.item.images)? JSON.parse(this.item.images[0]).Location : 'assets/empty.jpg';
	}

	public goToDetail(item: IAlliance){
		this.viewDetail.emit(item);
	}

}
