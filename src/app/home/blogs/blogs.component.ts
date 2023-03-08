import { Component, OnInit } from '@angular/core';
import { IPost } from '@apptypes/entities/post';
import { Api } from '@utils/api';
import { IPagination } from '@apptypes/pagination';
import { ApiResponseRecords, ApiResponse } from '@apptypes/api-response';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '@services/settings';
import { Entities } from '@services/entities';
import { Utilities } from '@utils/utilities';

@Component({
	selector: 'app-blogs',
	templateUrl: './blogs.component.html',
	styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {

	public _loadingInit: boolean;
	public _loadingPage: boolean;
	public _error: boolean;

	public _result: ApiResponseRecords<any>;
	public _currentPage: number;
	public _ItemsPerPage: number;

	public _pagination: IPagination;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		public api: Api
	) { }

	async ngOnInit() {
		this._error = false;
		this._loadingInit = true;
		this._loadingPage = true;

		this._currentPage = this.activatedRoute.snapshot.params.page;
		this._ItemsPerPage = this.activatedRoute.snapshot.params.numRecords;

		if (!this._currentPage || !this._ItemsPerPage) {
			if (!this._currentPage)
				this.router.navigate([`./1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
			else
				this.router.navigate([`../1/${AppSettings.defaultItemsPerPage}`], { relativeTo: this.activatedRoute });
		} else {
			this.loadEntidades();
		}

	}

	private async loadEntidades() {
		try {
			let resp: ApiResponse = await this.api.get(Entities.posts, null, this._currentPage, this._ItemsPerPage).toPromise();
			this._result = resp.response;

			this._pagination = {
				pages: Utilities.recordPages(this._result.pagesNumber),
				pagesNumber: this._result.pagesNumber,
				elementsNumber: this._result.elementsNumber,
				itemsPerPage: this._ItemsPerPage,
				currentPage: this._currentPage
			}

			if (!this._result.data.length && this._result.elementsNumber > 0) {
				this.goToPage({ pageNumber: this._result.pagesNumber });
			} else {
				this._loadingInit = false;
				this._loadingPage = false;
			}
		} catch (err) {
			if (this._loadingInit)
				this._error = true;
			else
				alert(err);

			this._loadingInit = false;
			this._loadingPage = false;
		}

		console.log('pagination: ', this._pagination);
	}

	public viewDetail(post: IPost) {
		if (this.router.url.toString().includes('business/')) {
			this.router.navigate([`./business/blogs/${this._currentPage}/${this._ItemsPerPage}`]).then(resp => {
				this.router.navigate([`./business/blogs/${this._currentPage}/${this._ItemsPerPage}/detail-blogs`, post.id]);
				document.documentElement.scrollTop = 0;
			});
		} else {
			this.router.navigate([`./home/blogs/${this._currentPage}/${this._ItemsPerPage}`]).then(resp => {
				this.router.navigate([`./home/blogs/${this._currentPage}/${this._ItemsPerPage}/detail-blogs`, post.id]);
				document.documentElement.scrollTop = 0;
			});
		}

	}

	public goToPage(event: any) {
		if (event.direction)
			event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

		this._loadingPage = true;
		this._currentPage = event.pageNumber;
		this.loadEntidades();
		this.router.navigate(['./../../' + event.pageNumber + '/' + this._ItemsPerPage], { relativeTo: this.activatedRoute });
	}
}
