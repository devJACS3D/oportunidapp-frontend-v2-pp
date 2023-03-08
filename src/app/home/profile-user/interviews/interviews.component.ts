import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MESSAGE } from 'src/app/constants/constants';
@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.scss']
})
export class InterviewsComponent implements OnInit {
  public tabs: any = [
    { name: `${MESSAGE.INTERVIEW}s` },
    { name: `${MESSAGE.PRE_INTERVIEW}s` }
  ];
  public routes: Object = {
    0: 'interviews',
    1: 'preinterviews'
  }
  // private _businessTypes: any[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    
  }

  handleTabChange(e) {
    if (!e) return;
    this.router.navigate([`./${this.routes[e.value]}`], { relativeTo: this.activatedRoute });
  }

}
