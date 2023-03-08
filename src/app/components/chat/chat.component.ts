import { Component, OnInit } from '@angular/core';
import { Api } from '@utils/api';
import { LoggedUser } from '@apptypes/types';
import { Subject } from 'rxjs';
import { UserAccountService } from '@services/user-account.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public eventsSubject: Subject<void> = new Subject<void>();
  public loggedUser: LoggedUser;

  constructor(
    private userAccount:UserAccountService
    ) { }

  async ngOnInit() {
    this.loggedUser = this.userAccount.getUser();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  onChat(data: any) {
    this.eventsSubject.next(data);
  }
  /*------------------------------------------------------------------------------------------------------------------------
      
    --------------------------------------------------------------------------------------------------------------------------*/
  isAdmins() {
    return (this.loggedUser.isAdminProfile || this.loggedUser.isPsychologistProfile)
  }


}
