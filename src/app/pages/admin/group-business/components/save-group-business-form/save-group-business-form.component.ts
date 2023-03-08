import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";

@Component({
  selector: "app-save-group-business-form",
  templateUrl: "./save-group-business-form.component.html",
  styleUrls: ["./save-group-business-form.component.scss"]
})
export class SaveGroupBusinessFormComponent implements OnInit {
  public businessForm: FormGroup;
  submitting$ = new Subject<boolean>();
  constructor(
    @Inject(MODAL_DATA) public business: any,
    @Inject(MODAL_REFERENCE) private ref: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.businessForm = this.formBuilder.group({
      id: [this.business.id],
      name: [this.business.name, [Validators.required,Validators.minLength(4)]],
      active: [this.business.active]
    });
  }

  save() {
    this.submitting$.next(true);

    if (!this.business.id) {
      return this.api
        .post(`${Entities.groupBusinesses}/create`, {
          ...this.businessForm.value
        })
        .pipe(finalize(() => this.submitting$.next(false)))
        .subscribe(
          res => {
            this.alert.successAlert("Empresa guardada exitosamente");
            this.ref.modalRef.close(true);
          },
          error => this.alert.errorAlert(error)
        );
    }

    return this.api
      .put(`${Entities.groupBusinesses}/update`, {
        ...this.businessForm.value
      },this.business.id)
      .pipe(finalize(() => this.submitting$.next(false)))
      .subscribe(
        res => {
          this.alert.successAlert("Empresa guardada exitosamente");
          this.ref.modalRef.close(true);
        },
        error => this.alert.errorAlert(error)
      );
  }
}
