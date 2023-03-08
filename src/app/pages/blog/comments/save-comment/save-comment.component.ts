import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entities } from '@services/entities';
import { UserAccountService } from '@services/user-account.service';
import { Api } from '@utils/api';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Component({
  selector: 'post-save-comment',
  templateUrl: './save-comment.component.html',
  styleUrls: ['./save-comment.component.scss']
})
export class SaveCommentComponent implements OnInit {

  @Input() postId: number;
  @Output() onComment = new EventEmitter<boolean>();
  commentForm: FormGroup;
  loading$ = new Subject<boolean>();
  constructor(
    private formBuilder: FormBuilder,
    private userAccount:UserAccountService,
    private alert:DialogService,
    private api:Api
  ) { }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      postId: [this.postId,[Validators.required]],
      description: [null,[Validators.required,Validators.minLength(1)]],
    })
  }

  saveComment(){
    const user = this.userAccount.getUser();
    if(!user.isAgentProfile){
      return this.alert.infoAlert("Por favor inicia sesión como un usuario para dejar tu comentario");
    }
    this.loading$.next(true);

    this.api.post(`${Entities.v2PostComment}/create`,{...this.commentForm.value})
    .pipe(finalize(()=> this.loading$.next(false)))
    .subscribe(res => {
      this.alert.successAlert("Comentario publicado exitosamente");
      this.commentForm.get('description').reset(null);
      this.onComment.emit(true);
    },(errorMsg)=> this.alert.errorAlert(errorMsg))
  }
}
