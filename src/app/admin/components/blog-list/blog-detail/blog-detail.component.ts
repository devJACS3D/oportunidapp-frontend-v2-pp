import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-blog-detail',
	templateUrl: './blog-detail.component.html',
	styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

	constructor(
		private location: Location
	) { }

	ngOnInit() {
	}

	public goBack(){
		this.location.back();
	}

}
