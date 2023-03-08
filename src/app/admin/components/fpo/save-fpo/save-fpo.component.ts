import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFactor } from '@apptypes/entities/factor';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable, Subject } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-save-fpo',
  templateUrl: './save-fpo.component.html',
  styleUrls: ['./save-fpo.component.scss']
})
export class SaveFPOComponent implements OnInit {

  header$: Observable<string>;
  factor$: Observable<IFactor>;
  submitting$: Subject<boolean> = new Subject();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alert: DialogService,
    private api: Api,
  ) { }

  ngOnInit() {
    this.header$ = this.activatedRoute.params
      .pipe(
        map((params) => params.id ? 'Editar factores FPO - Facetas' : 'Crear factores FPO - Facetas')
      )
    this.factor$ = this.activatedRoute.data
      .pipe(
        map((data) => data.factor ? data.factor : this.initializeFactor())
      )
  }

  initializeFactor(): IFactor {
    return {
      id: null,
      name: null,
      isMultiFacet: true,
      facets: [
        { name: null, id:null },
        { name: null, id:null }
      ]
    }
  }

  save(factor: IFactor) {
    this.submitting$.next(true);
    if (!factor.id) {
      return this.api.post(Entities.factors, factor)
        .pipe(
          finalize(() => this.submitting$.next(false))
        ).subscribe((res) => {
          this.successAlert(res.message);
          this.router.navigate(['../list'], { relativeTo: this.activatedRoute });
        }, (error) => this.errorAlert(error));
    }

    return this.api.put(Entities.factors, factor, factor.id)
      .pipe(
        finalize(() => this.submitting$.next(false))
      ).subscribe((res) => {
        this.successAlert(res.message);
        this.router.navigate(['../../list'], { relativeTo: this.activatedRoute });
      }, (error) => this.errorAlert(error));


  }

  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    })
  }

}
