import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utilities } from '@utils/utilities';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-print-pre-interview',
  templateUrl: './print-pre-interview.component.html',
  styleUrls: ['./print-pre-interview.component.scss']
})
export class PrintPreInterviewComponent implements OnInit {
  utils = Utilities;
  title = "Validación de pre entrevistas";
  preinterviews$: Observable<any>;
  headers = ["Concepto", "Aprobada"];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.preinterviews$ = this.activatedRoute.data.pipe(
      map(data => data.testData),
      tap(res => console.log(res))
    );
  }

  print() {
    window.print();
  }


}
