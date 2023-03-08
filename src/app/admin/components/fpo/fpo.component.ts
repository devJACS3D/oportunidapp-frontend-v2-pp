import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { TabComponent } from 'src/app/components/tabs/tab/tab.component';

@Component({
  selector: 'app-fpo',
  templateUrl: './fpo.component.html',
  styleUrls: ['./fpo.component.scss']
})
export class FPOComponent implements OnInit {

  tabOptions = [
    'Factores FPO - Facetas',
    'Items'
  ]

  public router$: Observable<any>;
  hidden$: Observable<boolean>;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.hidden$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute.snapshot),
      map(((route: ActivatedRouteSnapshot) => route.firstChild.routeConfig.path)),
      map((path: string) => this.hideInPath(path))
    )
  }

  private hideInPath(path: string): boolean {
    if (path.includes('list'))
      return false;

    return true;
  }
  handleTabChange(tab: TabComponent) {
    let url = null;

    if (tab.value == 0) {
      url = './list'
    } else {
      url = './items/list'
    }

    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }

}
