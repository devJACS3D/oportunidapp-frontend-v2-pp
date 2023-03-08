import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Subject } from "rxjs";
import { finalize } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS } from "src/app/constants/constants";

@Component({
  selector: "app-update-notification-modal",
  templateUrl: "./update-notification-modal.component.html",
  styleUrls: ["./update-notification-modal.component.scss"]
})
export class UpdateNotificationModalComponent implements OnInit {
  notificationForm: FormGroup;
  submitting$ = new Subject<boolean>();
  constructor(
    @Inject(MODAL_DATA) public data: any,
    @Inject(MODAL_REFERENCE) public ref: IModalReference,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.notificationForm = this.formBuilder.group({
      id: [this.data.id],
      content: [this.data.content, Validators.required]
    });
  }

  save() {
    this.submitting$.next(true);
    this.api
      .put(
        Entities.notifications,
        this.notificationForm.value,
        this.notificationForm.value.id
      )
      .pipe(finalize(() => this.submitting$.next(false)))
      .subscribe(
        res => {
          this.successAlert("Notificación actualizada correctamente");
          this.ref.modalRef.close(true);
        },
        error => this.errorAlert(error)
      );
  }

  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }

  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }
}
