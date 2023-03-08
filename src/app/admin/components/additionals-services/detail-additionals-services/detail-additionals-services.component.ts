import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IAdditionalService } from '@apptypes/entities/additional-service';

@Component({
	selector: 'app-detail-additionals-services',
	templateUrl: './detail-additionals-services.component.html',
	styleUrls: ['./detail-additionals-services.component.scss']
})
export class DetailAdditionalsServicesComponent implements OnInit {

	@Input() item: IAdditionalService;
	@Output() close = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public _close(){
		this.close.emit(true);
	}

}
