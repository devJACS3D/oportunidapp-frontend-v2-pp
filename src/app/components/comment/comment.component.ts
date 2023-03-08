import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from '@apptypes/IModal';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  commentForm: FormGroup;
  header: string = 'Añadir comentario'
  buttonText: string = 'Enviar';
  constructor(
    @Inject(MODAL_DATA) private data: { title: string, buttonText: string },
    @Inject(MODAL_REFERENCE) private modalRef: IModalReference,
    private _formBuilder: FormBuilder,
  ) {
    this.commentForm = this._formBuilder.group({
      comment: this._formBuilder.control(null, [Validators.required]),
    })
  }

  ngOnInit() {
  }
  send() {
    this.modalRef.modalRef.close(this.commentForm.value);
  }

}
