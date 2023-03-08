import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
  selector: "app-modal-add-comments",
  templateUrl: "./modal-add-comments.component.html",
  styleUrls: ["./modal-add-comments.component.scss"]
})
export class ModalAddCommentsComponent implements OnInit {
  formComments: FormGroup;
  submitClick$ = new Subject();
  loading$ = new Subject<boolean>();

  constructor() {}

  ngOnInit() {
    this.initForm()
  }

  /* ................................................................................................. */
  /* FORM */
  /* ................................................................................................. */
  initForm() {
    this.formComments = new FormGroup({
      comment: new FormControl(null, [Validators.required,Validators.minLength(4)])
    })
  }

  set setLoading(loading: boolean) {
    this.loading$.next(loading);
  }

  get data() {
    return this.submitClick$.asObservable();
  }

  onClick() {
    this.submitClick$.next(this.formComments.value);
  }
}
