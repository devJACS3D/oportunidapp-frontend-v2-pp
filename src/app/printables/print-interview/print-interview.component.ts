import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utilities } from '@utils/utilities';
import {  } from 'protractor';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-print-interview',
  templateUrl: './print-interview.component.html',
  styleUrls: ['./print-interview.component.scss']
})
export class PrintInterviewComponent implements OnInit {

  title = "Reporte de entrevista"
  utils = Utilities;
  interview$: Observable<any>;

  headers = ["Comentario","Fecha","Hora","Dirección","Aprobado"]
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.interview$ = this.activatedRoute.data.pipe(
      map(data => data.testData),
    );
  }
  print() {
    window.print();
  }

}
