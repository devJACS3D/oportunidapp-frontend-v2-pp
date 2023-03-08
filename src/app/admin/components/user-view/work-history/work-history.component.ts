import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBusinessAppUser } from '@apptypes/entities/BusinessAppUser';
import { ILaboralExperience } from '@apptypes/entities/ILaboralExperience';
import { applymentStatus } from '@apptypes/enums/applymentStatus.enum';
import { AUTHORIZED } from '@apptypes/enums/authorized.enum';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'user-work-history',
  templateUrl: './work-history.component.html',
  styleUrls: ['./work-history.component.scss']
})
export class WorkHistoryComponent implements OnInit {
  AUTHORIZED = AUTHORIZED;
  util = Utilities;
  @Input('workHistory') workHistory: ILaboralExperience[];
  @Input('applyment') applyment: IBusinessAppUser;
  steps = applymentStatus;
  @Output('saveReference') onSaveReference: EventEmitter<{ data: any }> = new EventEmitter();
  validateReference: boolean = false;
  referenceId: number;
  constructor() { }

  ngOnInit() {
  }
  
  getVerifiedText(reference: IValidationReferenceLaboral) {
    // we can validate.
    let text = 'Referencia no verificada';
    if (!reference) return text;

    if (reference.approved == false) {
      text = 'Referencia no valida';
    } else {
      text = 'Referencia verificada'
    }
    return text;
  }

  showValidate(historyId: number) {
    this.referenceId = historyId;
    this.validateReference = true;
  }

  saveReference(modalData: { data?: any }) {
    this.validateReference = false;
    if (!modalData.data) {
      this.referenceId = null;
      return;
    }
    this.onSaveReference.emit({...modalData.data,applyment:this.applyment});
  }

}
