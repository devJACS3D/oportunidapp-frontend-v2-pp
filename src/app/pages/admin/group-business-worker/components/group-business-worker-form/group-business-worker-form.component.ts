import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IState } from '@apptypes/entities/state';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'app-group-business-worker-form',
  templateUrl: './group-business-worker-form.component.html',
  styleUrls: ['./group-business-worker-form.component.scss']
})
export class GroupBusinessWorkerFormComponent implements OnInit {

  public workerForm: FormGroup;

  public states$:Observable<IState[]>;
  public cities$:Observable<IState[]>;
  stateControl = new FormControl(null);
  submitting$ = new Subject<boolean>();
  constructor(
    private api:Api,
    private alert: DialogService,
    private formBuilder:FormBuilder,
    @Inject(MODAL_DATA) public worker: any,
    @Inject(MODAL_REFERENCE) private ref: IModalReference,
  ) { }

  ngOnInit() {

    
    this.getStates();
    if(this.worker.id){
      this.stateControl.setValue(this.worker.city.stateId);
      this.getCities(this.worker.city.stateId)
    }


    this.initForm();

  }

  private initForm(){
    this.workerForm = this.formBuilder.group({
      id: [this.worker.id],
      fullName:[this.worker.fullName,[Validators.required]],
      email:[this.worker.email,[Validators.email,Validators.required]],
      cityId:[this.worker.cityId,[Validators.required]],
      groupBusinessId: [this.worker.groupBusinessId],
    });
  }

  private getStates() {
    this.states$ = this.api
      .get(Entities.states, null, 1, 1000)
      .pipe(map(res => res.response.data));
  }

  getCities(stateId: number) {
    this.cities$ = this.api
      .get(Entities.cities, null, 1, 1000, { stateId })
      .pipe(map(res => res.response.data));
  }

  save() {
    this.submitting$.next(true);

    if (!this.worker.id) {
      return this.api
        .post(`${Entities.groupBusinessesWorkers}/create`, {
          ...this.workerForm.value
        })
        .pipe(finalize(() => this.submitting$.next(false)))
        .subscribe(
          res => {
            this.alert.successAlert("Empleado guardado exitosamente");
            this.ref.modalRef.close(true);
          },
          error => this.alert.errorAlert(error)
        );
    }

    return this.api
      .put(`${Entities.groupBusinessesWorkers}/update`, {
        ...this.workerForm.value
      },this.worker.id)
      .pipe(finalize(() => this.submitting$.next(false)))
      .subscribe(
        res => {
          this.alert.successAlert("Empleado guardado exitosamente");
          this.ref.modalRef.close(true);
        },
        error => this.alert.errorAlert(error)
      );
  }

}
