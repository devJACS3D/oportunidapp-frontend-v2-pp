import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';
import { IPost } from '@apptypes/entities/post';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '@services/settings';

@Component({
	selector: 'app-posts-section',
	templateUrl: './posts-section.component.html',
	styleUrls: ['./posts-section.component.scss']
})
export class PostsSectionComponent implements OnInit {

	public _loadingInit: boolean;
	public _loadError: string;

	public _posts: IPost[];

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private api: Api
	) { }

	async ngOnInit() {
		this._loadingInit = true;
		this._loadError = '';

		try {

			let resp = await this.api.get(Entities.posts, null, 1, 3).toPromise();
			this._posts = resp.response.data;
			
		} catch (err) {
			this._loadError = err;
		}

		this._loadingInit = false;
	}

	public viewDetail(post: IPost){
		
		this.router.navigate([`./home/blogs/1/${AppSettings.defaultItemsPerPage}/detail-blogs`, post.id]).then(resp =>{
			// this.router.navigate([`./home/blogs/${this._currentPage}/${this._ItemsPerPage}/detail-blogs`, post.id]);
			document.documentElement.scrollTop = 0;
		});
		
		
		// this.router.navigate(['detail-blogs/', post.id], {relativeTo: this.activatedRoute});
		// alert(post.name);
		// this.router.navigate(['detail-blogs/', { outlets: { blog-detail: 'blog-detail' }, relativeTo: this.activatedRoute }]);
		// this.router.navigate(['./detail-blogs', { outlets: { blogDetail: ['blog-detail', post.id] }, relativeTo: this.activatedRoute }]);
	}

}
