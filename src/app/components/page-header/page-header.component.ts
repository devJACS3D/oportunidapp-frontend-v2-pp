import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input('class') class: string;
  @Input('backButton') backButton: boolean = true;
  @Input('backTo') backTo: string;
  @Input('relativeToRouter') relativeToRouter: boolean = true;
  @Input('header') header: string = '¡This is a nice page!';
  @Input('classes') classes: string;
  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
  }

  goBack() {

    let extras: NavigationExtras = {};
    if (this.relativeToRouter) {
      extras.relativeTo = this._activatedRoute;
    }
    this._router.navigate([this.backTo], extras);
  }

}
