import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: "app-modal-change-password",
  templateUrl: "./modal-change-password.component.html",
  styleUrls: ["./modal-change-password.component.scss"]
})
export class ModalChangePasswordComponent implements OnInit {
  formPassword: FormGroup;
  submitClick$ = new Subject();
  loading$ = new Subject<boolean>();

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  /* ................................................................................................. */
  /* FORM */
  /* ................................................................................................. */
  initForm() {
    this.formPassword = new FormGroup(
      {
        currentPassword: new FormControl(null, [Validators.required]),
        newPassword: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?!.*\s)[A-Za-z\d\w\W]{6,50}$/)
        ]),
        repeatNewPassword: new FormControl(null, [Validators.required])
      },
      {
        validators: this.checkPasswords
      }
    );
  }

  checkPasswords: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const newPassword = group.get("newPassword").value;
    const repeatNewPassword = group.get("repeatNewPassword").value;
    return newPassword !== repeatNewPassword && { notSame: true };
  };

  set setLoading(loading: boolean) {
    this.loading$.next(loading);
  }

  get data() {
    return this.submitClick$.asObservable();
  }

  onClick() {
    this.submitClick$.next(this.formPassword.value);
  }
}
