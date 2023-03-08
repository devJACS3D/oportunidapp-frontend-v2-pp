import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiResponse } from '@apptypes/api-response';
import { ITrainingPlan } from '@apptypes/entities/ITrainingPlan';
import { ACTIONS } from '@apptypes/enums/actions.enum';
import { IPagination } from '@apptypes/pagination';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { ModalService } from 'src/app/components/modal/modal.service';
import { COLORS } from 'src/app/constants/constants';
import { SaveTrainingPlanComponent } from '../save-training-plan/save-training-plan.component';

@Component({
  selector: 'app-training-plan-list',
  templateUrl: './training-plan-list.component.html',
  styleUrls: ['./training-plan-list.component.scss']
})
export class TrainingPlanListComponent implements OnInit {

  //component
  header: string = 'Planes de formación';

  //table
  tableHeaders: string[] = ['Nombre', 'Descripción', 'Ultima edición']
  trainingPlans$: Observable<ITrainingPlan[]>;
  private currentPage$ = new Subject<number>();
  _trainingPlans: ITrainingPlan[];
  //pagination
  private _pagination: IPagination;
  public loadingPage: boolean;
  private itemsPerPage: number = 10;
  // utils
  utils = Utilities;
  //viewchild
  constructor(
    private api: Api,
    private dialog: DialogService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.trainingPlans$ = this.currentPage$.pipe(
      startWith(1),
      tap(() => this.loadingPage = true),
      switchMap((page) => this.fetchData(page))
    )

  }

  set trainingPlans(trainingPlans: ITrainingPlan[]) {
    this._trainingPlans = trainingPlans;
  }
  set pagination(pagination) {
    this._pagination = {
      pages: this.utils.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: pagination.currentPage
    }
  }
  get trainingPlans(): ITrainingPlan[] {
    return this._trainingPlans;
  }
  get pagination(): any {
    return this._pagination;
  }

  /* ................................................................................................. */
  /* FETCH DATA */
  /* ................................................................................................. */
  private fetchData(page: number): Observable<ITrainingPlan[]> {
    return this.api.get(Entities.trainingPlans, null, page, this.itemsPerPage)
      .pipe(
        tap((res) => res.response['currentPage'] = page),
        tap((response) => this.pagination = response.response),
        map((response) => response.response.data || []),
        finalize(() => this.loadingPage = false),
        catchError(() => of([]))
      )
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber = parseInt(event.pageNumber.toString()) + parseInt(event.direction.toString());

    this.currentPage$.next(event.pageNumber);
  }

  /* ................................................................................................. */
  /* CREATE/EDIT/REMOVE training plan */
  /* ................................................................................................. */

  createTrainingPlan() {
    const modal = this.modalService.create(SaveTrainingPlanComponent, {
      data: {
        type: ACTIONS.CREATE
      }
    });
    modal.afterDestroy$.subscribe(() => this.currentPage$.next(this.pagination.currentPage));
  }

  public async goToUpdate(trainingPlanId: number) {
    try {
      const { response } = await this.api.get(Entities.trainingPlans, trainingPlanId).toPromise() as ApiResponse;

      const modal = this.modalService.create(SaveTrainingPlanComponent, {
        data: {
          ...response,
          type: ACTIONS.EDIT
        }
      });
      modal.afterDestroy$.subscribe(() => this.currentPage$.next(this.pagination.currentPage));

    } catch (error) {
      console.log(error);
      this.errorResponse(error);
    }
  }

  public activateDeleteModal(trainingPlan: ITrainingPlan) {

    if (trainingPlan.id === 1) return;

    const message = `¿Desea eliminar el plan de formación ${trainingPlan.name}?`;
    this.dialog.customAlert({
      icon: 'delete',
      bgColor: COLORS.DANGER,
      bgBottom: true,
      message,
      buttons: [
        {
          name: 'Eliminar',
          onClick: async () => {
            this.dialog.loadingAlert(this.dialog, true);
            await this.delete(trainingPlan);
            this.dialog.loadingAlert(this.dialog, false);
            this.dialog.closeAlert();
            this.successResponse(`Se ha eliminado exitosamente el plan de formacion ${trainingPlan.name}`);
          }
        }
      ]
    })
  }
  public async delete(trainingPlan: ITrainingPlan) {
    try {
      await this.api.delete(Entities.trainingPlans, trainingPlan.id).toPromise() as ApiResponse;
      this.currentPage$.next(this.pagination.currentPage);
      //this.trainingPlans = this.trainingPlans.filter(tplan => tplan.id !== trainingPlan.id);
      return true;
    } catch (err) {
      this.errorResponse(err);
    }
  }
  /* ................................................................................................. */
  /* Add or remove to training plan lists */
  /* ................................................................................................. */
  addToList(trainingPlan: ITrainingPlan) {
    if (!trainingPlan['isEditing']) {
      this.trainingPlans.push(trainingPlan);
    } else {
      let found = this.trainingPlans.find(tplan => tplan.id == trainingPlan.id);
      found = Object.assign(found, trainingPlan);
    }
  }

  /* ................................................................................................. */
  /* Success and error responses */
  /* ................................................................................................. */
  private successResponse(message: string) {
    this.dialog.customAlert({
      icon: COLORS.SUCCESS,
      message,
      bgColor: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    })
  }

  private errorResponse(message: string) {
    this.dialog.customAlert({
      icon: COLORS.WARNING,
      message,
      bgColor: COLORS.DANGER,
      bgBottom: true,
      autoClose: true
    })
  }
}
