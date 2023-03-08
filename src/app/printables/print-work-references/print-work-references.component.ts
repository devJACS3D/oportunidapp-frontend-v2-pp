import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utilities } from '@utils/utilities';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-print-work-references',
  templateUrl: './print-work-references.component.html',
  styleUrls: ['./print-work-references.component.scss']
})
export class PrintWorkReferencesComponent implements OnInit {

  utils = Utilities;
  title = "Validación de referencias";
  workReferences$: Observable<any>;
  headers = ["Jefe inmediato","Funciones","Fecha de inicio","Fecha fin","Empresa","Comentario","Aprobada"]

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.workReferences$ = this.activatedRoute.data.pipe(
      map(data => data.testData),
      tap((res)=>console.log(res))
    );
  }

  print(){
    window.print();
  }

}
