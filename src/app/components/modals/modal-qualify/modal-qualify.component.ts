import { Component, OnInit, Inject } from '@angular/core';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Api } from "@utils/api";
import { Entities } from '@services/entities';
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { QUALIFY } from '@apptypes/enums/qualify';
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-modal-qualify',
  templateUrl: './modal-qualify.component.html',
  styleUrls: ['./modal-qualify.component.scss']
})
export class ModalQualifyComponent implements OnInit {
  public title: string
  public subtitle: string = "¿Cómo calificas el rendimiento de"
  public typeQualify: QUALIFY
  public qualifyForm: FormGroup;
  public fullName: string;
  public submitting$ = new Subject();
  public loadingData: boolean = false;

  constructor(
    @Inject(MODAL_DATA) private data: any,
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService,
  ) { }

  ngOnInit() {
    this.initForm(this.data);
  }
  /*------------------------------------------------------------------------------------------------------------------------
      Get all the values ​​that come from the form group
  --------------------------------------------------------------------------------------------------------------------------*/
  get payload() {
    return this.formatData()
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async initForm(initValues?: any) {
    if (initValues.title) this.title = initValues.title
    if (initValues.subtitle) this.subtitle = initValues.subtitle
    if (initValues.fullName) this.fullName = initValues.fullName
    if (initValues.typeQualify >= 0) this.typeQualify = initValues.typeQualify
    this.qualifyForm = this.formBuilder.group({
      qualification: [0, [Validators.required]],
      comment: [null, [Validators.required]],
    })
  }

  /*------------------------------------------------------------------------------------------------------------------------
   Send data to server 
   --------------------------------------------------------------------------------------------------------------------------*/
  async save() {
    if (this.qualifyForm.invalid) return;
    this.loadingData = true
    this.submitting$.next(true);
    const params = this.qualifyParams()
    this.api
      .post(params.entities, this.payload)
      .pipe(finalize(() => { this.submitting$.next(false); this.loadingData = false; }))
      .subscribe(
        res => {
          this.alert.successAlert(res.message);
          this.modalRef.modalRef.close(params.close)
        },
        error => {
          this.alert.errorAlert(error);
        }
      );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  qualifyParams() {
    const params = {
      [QUALIFY.CANDIDATES]: ({ entities: `${Entities.qualifications}/create/qualifyCandidate`, close: { redirectToAptos: true } }),
      [QUALIFY.PLATFORM]: ({ entities: `${Entities.qualifications}/create/qualifyPlatform`, close: { qualified: true } })
    }
    return params[this.typeQualify]
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  formatData() {
    let payload = this.qualifyForm.value
    payload.qualification = String(payload.qualification)
    let data = this.data
    delete data.title
    delete data.subtitle
    delete data.typeQualify
    delete data.fullName
    return {
      ...data,
      ...payload
    }
  }
}
