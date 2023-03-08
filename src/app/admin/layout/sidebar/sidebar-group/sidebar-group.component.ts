import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidebarItem } from '@apptypes/sidebar-item';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-sidebar-group',
	templateUrl: './sidebar-group.component.html',
	styleUrls: ['./sidebar-group.component.scss']
})
export class SidebarGroupComponent implements OnInit {

	showItems: boolean;


	@Input('groupItems') itemGroup: SidebarItem;
	@Input() hiddenText: boolean;
	@Output() onItemClick = new EventEmitter<SidebarItem>();
	constructor(
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.showItems = false;
	}

}
