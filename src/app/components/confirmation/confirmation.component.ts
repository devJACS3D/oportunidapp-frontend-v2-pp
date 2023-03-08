import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

	@Input() _message: string;
	@Input() _loadingConfirm: boolean;
	@Output() close = new EventEmitter();
	@Output() confirm = new EventEmitter();

	constructor() { }

	ngOnInit() {
	}

	public _close(){
		this.close.emit(true);
	}

	public _confirm(){
		this.confirm.emit(true);
	}
}
