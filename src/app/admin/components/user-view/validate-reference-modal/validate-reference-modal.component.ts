import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILaboralExperience } from '@apptypes/entities/ILaboralExperience';

@Component({
  selector: 'validate-reference-modal',
  templateUrl: './validate-reference-modal.component.html',
  styleUrls: ['./validate-reference-modal.component.scss']
})
export class ValidateReferenceModalComponent implements OnInit {

  step: number = 1;
  referenceForm: FormGroup;
  @Output('onClose') onClose: EventEmitter<{ data?: any }> = new EventEmitter();
  @Input('referenceId') referenceId: number;
  constructor() { }

  ngOnInit() {
    this.referenceForm = new FormGroup({
      status: new FormControl(false),
      comment: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      id: new FormControl(this.referenceId)
    });
  }

  close(data?) {
    this.onClose.emit({ data: data });
  }

  setReferenceStatus(value: boolean, nextStep: boolean = true) {
    this.referenceForm.get('status').setValue(value);
    if (nextStep)
      this.step++;
  }

}
