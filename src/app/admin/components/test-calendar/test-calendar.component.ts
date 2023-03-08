import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Api } from '@utils/api';
import { Entities } from '@services/entities';

@Component({
	selector: 'app-test-calendar',
	templateUrl: './test-calendar.component.html',
	styleUrls: ['./test-calendar.component.scss']
})
export class TestCalendarComponent implements OnInit {

	constructor(
		private api: Api,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	async ngOnInit() {
		await this.api.get(Entities.interviews, null, 1, 100).toPromise();
	}

	public viewInterview(){
		let id = 3;

		this.router.navigate(['./interview/', id], {relativeTo: this.activatedRoute});
	}

}
