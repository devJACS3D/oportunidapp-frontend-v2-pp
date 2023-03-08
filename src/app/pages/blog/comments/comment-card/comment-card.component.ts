import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoggedUser } from '@apptypes/types';
import { UserAccountService } from '@services/user-account.service';
import { Utilities } from '@utils/utilities';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

  utils = Utilities;
  @Input() comment: any;
  @Output() onDelete = new EventEmitter<number>();
  user$: Observable<LoggedUser>;
  @Input("loading") loading$:Subject<boolean>;
  constructor(
    private userAccount:UserAccountService
  ) { }

  ngOnInit() {
    this.user$ = this.userAccount.getUser$();
  }

  deleteComment(){
    this.onDelete.emit(this.comment.id);
  }
}
