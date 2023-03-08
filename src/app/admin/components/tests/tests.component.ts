import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TabComponent } from 'src/app/components/tabs/tab/tab.component';

@Component({
	selector: 'app-tests',
	templateUrl: './tests.component.html',
	styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

	public tests = ['Gestión de pruebas psicotécnicas', 'Pruebas psicotécnicas realizadas']
	$routeSubscription: Subscription;
	hidden: boolean;
	constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.$routeSubscription = this._router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this._activatedRoute.snapshot),
		).subscribe((route: ActivatedRouteSnapshot) => {
			this.hideInPath(route.firstChild.routeConfig.path)
		});
	}

	handleTabChange(tab: TabComponent) {
		let path;
		if (tab.value == 0)
			path = './'
		else
			path = './users/done'
		return this._router.navigate([path], { relativeTo: this._activatedRoute });
	}

	hideInPath(path: string) {
		switch (path) {
			case '':
			case 'users/:done':
				this.hidden = false;
				break;
			default:
				this.hidden = true;
				break;
		}
	}
}
