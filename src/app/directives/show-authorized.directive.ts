import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LoggedUser } from '@apptypes/types';
import { UserAccountService } from '@services/user-account.service';
import { Api } from '@utils/api';

@Directive({
  selector: '[ShowAuthorized]'
})
export class ShowAuthorizedDirective implements OnInit {

  user: LoggedUser;
  authorized: string[] | string;
  constructor(
    private templateRef: TemplateRef<any>,
    private userAccount: UserAccountService,
    private viewContainer: ViewContainerRef
  ) { }

  @Input('ShowAuthorized') set ShowAuthorized(auths: string[] | string) {
    this.authorized = auths;
  }

  ngOnInit() {
    this.user = this.userAccount.getUser();
    let show: boolean;
    if (Array.isArray(this.authorized)) {
      show = this.authorized.some(isProfile => this.user[isProfile] == true);
    } else if (typeof this.authorized === 'string') {
      show = this.user[this.authorized];
    }

    show == true? this.viewContainer.createEmbeddedView(this.templateRef):
    this.viewContainer.clear();
  }
}
