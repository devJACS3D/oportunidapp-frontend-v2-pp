import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IPost } from '@apptypes/entities/IPost';
// import { EventEmitter } from 'events';

@Component({
	selector: 'app-card-blog',
	templateUrl: './card-blog.component.html',
	styleUrls: ['./card-blog.component.scss']
})
export class CardBlogComponent implements OnInit {

	@Input('blog') item: IPost;
	@Output() viewDetail: EventEmitter<any> = new EventEmitter<any>();

	public urlImage: string;

	constructor() {}

	ngOnInit() {
		this.urlImage = JSON.parse(this.item.images[0]).Location;
	}

	public goToDetail(item: IPost){
		this.viewDetail.emit(item);
	}
}
