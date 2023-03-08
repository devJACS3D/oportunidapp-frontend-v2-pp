import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COLORS } from 'src/app/constants/constants';
import { DialogService } from '../dialog-alert/dialog.service';

@Component({
  selector: 'add-comment-modal',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {

  public opts = {
    header: 'Añadir comentario',
    description: null,
    isSubmitting: false,
    hidden: true,
  }
  @Output('onSend') onSend: EventEmitter<{ comment: string }> = new EventEmitter();
  commentForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
		private _alert: DialogService
    ) {
    this.commentForm = this._formBuilder.group({
      comment: this._formBuilder.control(null, [Validators.required]),
      data: this._formBuilder.control(null),
    })
  }

  ngOnInit() {
  }

  @Input() set data(data: any) {
    this.commentForm.get('data').setValue(data);
  }
  @Input() set options(opts: Object) {
    this.opts = Object.assign(this.opts, opts);
  }
  @Input() set isSubmitting(state: boolean) {
    this.opts.isSubmitting = state;
  }
  open() {
    this.opts.hidden = false;
  }

  private resetOpts() {
    this.opts = {
      header: 'Añadir comentario',
      description: null,
      isSubmitting: false,
      hidden: true,
    }
  }

  close(showSuccessAlert?: boolean) {
    this.commentForm.reset();
    this.resetOpts();
    if(showSuccessAlert)
      this.successCommentAlert();
  }

  successCommentAlert(){
    this._alert.customAlert({
      icon: COLORS.SUCCESS,
      message: 'Comentarios enviados exitosamente.',
      bgColor: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }

  send() {
    this.onSend.emit({ ...this.commentForm.value });
  }

}
