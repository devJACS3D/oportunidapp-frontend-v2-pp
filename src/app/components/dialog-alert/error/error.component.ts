import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	public message: string;

	@Output() onOkButton = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public okButtonClick(){
		this.onOkButton.emit();
	}
}
