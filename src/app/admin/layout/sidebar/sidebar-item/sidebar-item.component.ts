import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SidebarItem } from '@apptypes/sidebar-item';

@Component({
	selector: 'app-sidebar-item',
	templateUrl: './sidebar-item.component.html',
	styleUrls: ['./sidebar-item.component.scss']
})
export class SidebarItemComponent implements OnInit {

	@Input() item: SidebarItem;
	@Input() hiddenText: boolean;
	@Output() onItemClick = new EventEmitter<SidebarItem>();
	constructor() { }

	ngOnInit() {
	}

}
