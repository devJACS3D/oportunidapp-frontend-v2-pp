import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPrintPsychoTest } from '@apptypes/entities/IPrint';
import { Utilities } from '@utils/utilities';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-print-psychotechnical-test',
  templateUrl: './print-psychotechnical-test.component.html',
  styleUrls: ['./print-psychotechnical-test.component.scss']
})
export class PrintPsychotechnicalTestComponent implements OnInit {

  title: string = 'Resultado de prueba de competencias';
  psychoTest$: Observable<IPrintPsychoTest>;
  headers = ['Competencias', 'Concepto', 'Porcentaje obtenido', 'Nivel', 'Plan de formación'];
  public utils = Utilities;
  feedback: string = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.psychoTest$ = this.activatedRoute.data.pipe(
      map(data => data.testData),
      tap((res: IPrintPsychoTest) => {
        this.feedback = res.test.data.map(test => test.behavior.feedback).join('.');
      })
    );
  }

  print() {
    window.print();
  }

}
