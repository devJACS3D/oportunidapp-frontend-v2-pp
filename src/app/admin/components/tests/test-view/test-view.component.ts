import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Utilities } from '@utils/utilities';

@Component({
	selector: 'app-test-view',
	templateUrl: './test-view.component.html',
	styleUrls: ['./test-view.component.scss']
})
export class TestViewComponent implements OnInit {

	utils = Utilities;
	test: any;
	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
	) { }

	async ngOnInit() {
		this._activatedRoute.data.pipe(
			map((res) => res.test)
		).subscribe(data => this.test = data[0]);
	}

	public close() {
		this._router.navigate(['../users', 'done'], { relativeTo: this._activatedRoute });
	}

	print(){
		console.log('ive clicked!');
	}
}
