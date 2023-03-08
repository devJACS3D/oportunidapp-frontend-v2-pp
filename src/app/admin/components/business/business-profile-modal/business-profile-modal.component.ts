import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBusiness } from '@apptypes/entities/IBusiness';
import { IBusinessType } from '@apptypes/entities/IBusinessType';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Observable, Subject } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-business-profile-modal',
  templateUrl: './business-profile-modal.component.html',
  styleUrls: ['./business-profile-modal.component.scss']
})
export class BusinessProfileModalComponent implements OnInit {

  header = 'Editar empresa';
  businessForm: FormGroup;
  submitting$ = new Subject<boolean>();
  businessTypes$:Observable<IBusinessType[]>;
  constructor(
    @Inject(MODAL_DATA) public business: IBusiness,
    @Inject(MODAL_REFERENCE) private modal: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert:DialogService,
  ) { }

  ngOnInit() {
    this.businessTypes$ = this.api.get(Entities.businessTypes,null,null,null)
    .pipe(
      map((res) => res.response || [])
    )
    this.businessForm = this.formBuilder.group({
      nit:[this.business.nit],
      name: [this.business.name, [Validators.required]],
      description: [this.business.description, [Validators.required]],
      mission: [this.business.mission, [Validators.required]],
      vision: [this.business.vision, [Validators.required]],
      businessTypeId: [this.business.businessTypeId, [Validators.required]],
      principles: [this.business.principles, [Validators.required]],
    })
  }

  update() {
    this.submitting$.next(true);
    this.api.put(Entities.companies,this.businessForm.value,this.business.id)
    .pipe(
      finalize(()=> this.submitting$.next(false))
    ).subscribe(res => {
      this.successAlert(res.message);
      this.modal.modalRef.close(true);
    },(error)=> this.errorAlert(error));
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
