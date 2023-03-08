import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-calendar-header',
	templateUrl: './calendar-header.component.html',
	styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit {

	date: Date;
	@Input() view: string;
	@Input() viewDate: Date;
	@Input() locale: string = 'es';
	@Input() excludeDays: number[] = [];
	@Input() weekStartsOn: number = 0;
	constructor() { }

	ngOnInit() {
		this.date = new Date();
	}


	

	@Output() viewChange: EventEmitter<string> = new EventEmitter();

	@Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
}
