import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketIOService } from '@services/socketIO/socketIO.service';
@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketIOService) { }
  ngOnDestroy(): void {
  }


  ngOnInit() {
  }
}
