import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFpoItem } from '@apptypes/entities/factor';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-edit-fpo-item',
  templateUrl: './edit-fpo-item.component.html',
  styleUrls: ['./edit-fpo-item.component.scss']
})
export class EditFpoItemComponent implements OnInit {
  header = 'Editar item'
  fpoItemForm: FormGroup;
  submitting$: Subject<boolean> = new Subject();
  constructor(
    @Inject(MODAL_DATA) public data: IFpoItem,
    @Inject(MODAL_REFERENCE) public modalRef: IModalReference,
    private formBuilder: FormBuilder,
    private alert:DialogService,
    private api:Api
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.fpoItemForm = this.formBuilder.group({
      content: [this.data.content, [Validators.required]],
    });
  }

  save(){
    this.submitting$.next(true);
    this.api.put(Entities.fpoItems,this.fpoItemForm.value,this.data.id)
    .pipe(
      finalize(() => this.submitting$.next(false))
    ).subscribe(res => {
      this.successAlert(res.message);
      this.modalRef.modalRef.close(true);
    },(error) => this.errorAlert(error));
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
