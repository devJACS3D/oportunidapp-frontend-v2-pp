import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-success',
	templateUrl: './success.component.html',
	styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

	public title: string;
	public message: string;

	@Output() onOkButton = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	okButtonClick(){
		this.onOkButton.emit();
	}

}
