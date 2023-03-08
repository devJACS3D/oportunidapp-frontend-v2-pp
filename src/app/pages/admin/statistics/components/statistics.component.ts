import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabComponent } from 'src/app/components/tabs/tab/tab.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {


  tabs = ["Estadísticas","Indicadores"]
  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
  }

  handleTabChange(tab:TabComponent){

    // go to main
    if(tab.value  == 0){
      return this.router.navigate(['admin/statistics/main']);
    }

    return this.router.navigate(['admin/statistics/indicators']);
  }

}
