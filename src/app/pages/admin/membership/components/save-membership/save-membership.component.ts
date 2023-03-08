import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { RegexUtils } from '@utils/regex-utils';
import { Subject } from 'rxjs';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';
import { COLORS } from 'src/app/constants/constants';

@Component({
  selector: 'app-save-membership',
  templateUrl: './save-membership.component.html',
  styleUrls: ['./save-membership.component.scss']
})
export class SaveMembershipComponent implements OnInit {

  title: string = 'Crear membresia';
  submitting$ = new Subject();
  public maskCurrency: RegExp = RegexUtils._maskCurrency;
  public membershipForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private api: Api,
    @Inject(MODAL_DATA) private data: any,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private alert: DialogService
  ) { }

  ngOnInit() {

    if (this.data.id) {
      this.title = 'Editar membresia';
    }

    this.initForm(this.data);
  }

  initForm(initValues?: any) {
    this.membershipForm = this.formBuilder.group({
      id: [initValues.id],
      label: [initValues.label, [Validators.required, Validators.maxLength(100)]],
      price: [initValues.price, [Validators.required, Validators.pattern(RegexUtils._rxCurrency), Validators.maxLength(14)]],
      subtitulo: [initValues.subtitulo],
      range: [initValues.range, [Validators.required, Validators.min(1), Validators.max(365)]],
      vacancies: [initValues.vacancies, [Validators.required, Validators.min(1), Validators.max(99)]],
      description: [initValues.description, [Validators.required, Validators.maxLength(500)]]
    });
  }


  save() {
    if (this.membershipForm.invalid) return;
    this.submitting$.next(true);
    const payload = this.payload;
    //editing
    if (payload.id) {
      return this.api.put(Entities.packages, payload, payload.id)
        .subscribe((res) => {
          this.successAlert(res.message);
          this.modalRef.modalRef.close(true);
        }, (err) => this.errorAlert(err), () => this.submitting$.next(false));
    }
    // Saving new
    return this.api.post(Entities.packages, payload)
      .subscribe((res) => {
        this.successAlert(res.message);
        this.modalRef.modalRef.close(true);
      }, (err) => this.errorAlert(err), () => this.submitting$.next(false));
  }

  get payload() {
    const payload = {
      ...this.membershipForm.value,
      price: RegexUtils._unMaskCurrency(this.membershipForm.value.price),
    }
    return payload;
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
