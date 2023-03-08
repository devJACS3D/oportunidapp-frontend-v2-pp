import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utilities } from '@utils/utilities';
import { ModalQualificationsComponent } from 'src/app/components/modals/modal-qualifications/modal-qualifications.component';
import { ModalService } from 'src/app/components/modal/modal.service';
import { QUALIFY } from '@apptypes/enums/qualify';
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Observable, of, BehaviorSubject } from "rxjs";
import {
  catchError,
  finalize,
  map,
  switchMap,
  tap
} from "rxjs/operators";
import { STATISTICS } from '@apptypes/enums/statistics';


@Component({
  selector: 'app-statistics-graphic',
  templateUrl: './statistics-graphic.component.html',
  styleUrls: ['./statistics-graphic.component.scss']
})
export class StatisticsGraphicComponent implements OnInit {

  public statistics$: Observable<any[]>
  filter$ = new BehaviorSubject<any>({});
  constructor(
    private api: Api,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.statistics$ = this.filter$.pipe(
      switchMap(res => this.fetchData(res))
    )
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  filter(data) {
    this.filter$.next(data)
  }
  /*------------------------------------------------------------------------------------------------------------------------
      FETCHS
  --------------------------------------------------------------------------------------------------------------------------*/
  public fetchData(params?: any) {
    return this.api
      .get(`${Entities.newStatistics}/list/statistics`, null, 1, 1000, params)
      .pipe(
        map(response => response.response || []),
        catchError(() => of([]))
      )
  }
  onClick(keyword: any) {
    const events = {
      [STATISTICS.QUALIFIED_CANDIDATES]: () => this.qualifications(QUALIFY.CANDIDATES),
      [STATISTICS.QUALIFIED_PLATFORM]: () => this.qualifications(QUALIFY.PLATFORM)
    }
    return events[keyword] && events[keyword]();
  }

  qualifications(typeQualify: QUALIFY) {
    this.modalService.create(ModalQualificationsComponent, {
      data: { typeQualify }
    });
  }

}
