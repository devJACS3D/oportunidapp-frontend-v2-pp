import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoggedUser } from '@apptypes/types';
import { Entities } from '@services/entities';
import { ApiResponse } from '@apptypes/api-response';
import { UserTypes } from '@apptypes/enums/userTypes.enum';
import { Api } from '@utils/api';
import { Utilities } from '@utils/utilities';

@Component({
  selector: 'chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss']
})
export class ChatHistoryComponent implements OnInit {

  @Input() loggedUser: LoggedUser;
  @Output() chat = new EventEmitter();
  public userList = [];
  public chats: any = [];
  public copyChats: any = [];
  public utils = Utilities
  public _error: boolean;
  public loadingPage: boolean;
  public _currentPage: number = 1;
  public _ItemsPerPage: number = 10000;

  constructor(private api: Api) { }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async ngOnInit() {
    // console.log(this.loggedUser);
    this.chatHistory()
  }

  async chatHistory() {
    const apiUri = this.isAdmins() ? Entities.administrators : Entities.userChats
    const params = this.isAdmins() ? { utype: UserTypes.AGENT } : { to: this.loggedUser.id }
    this.loadingPage = true;
    try {
      const response: ApiResponse = await this.api.get(apiUri, null, this._currentPage, this._ItemsPerPage, params).toPromise();
      const chatHistory = this.isAdmins() ? response.response.data : response.response
      this.chats = this.copyChats = chatHistory
      this._error = null;
    } catch (error) {
      this._error = error;
    } finally {
      this.loadingPage = false;
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async onClickChat(item: any, e: any) {
    let chat: any = {}
    if (this.isAdmins()) {
      const newChat = this.userList.find(elem => elem.id === item.id)
      if (!newChat) {
        const params = { from: this.loggedUser.id, to: item.id }
        const response: ApiResponse = await this.api.get(Entities.adminChats, null, this._currentPage, this._ItemsPerPage, params).toPromise();
        const { id, uuid, from, to } = response.response
        const data = { id: item.id, chatId: id, uuid, from, to }
        this.userList.push(data)
        chat = data
      } else {
        chat = newChat
      }
      delete chat.id
      chat.image = item.image
      chat.last_singin = item.credentialUser.last_singin
      chat.fullName = item.fullName
      chat.updatedAt = item.updatedAt
    }
    if (!this.isAdmins()) {
      chat.chatId = item.id
      chat.uuid = item.uuid
      chat.image = this.loggedUser.image
      chat.fullName = `${this.loggedUser.firstName} ${this.loggedUser.lastName}`
      chat.last_singin = this.loggedUser.last_singin
      chat.updatedAt = this.loggedUser.updatedAt
      this.showMessages(item.id, e)
    }
    this.chat.emit(chat)
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async showMessages(chatId: any, e: any) {
    try {
      const itemCount = e.querySelector('span')
      if (itemCount) itemCount.remove()
      await this.api.put(Entities.userUpdateChatMessages, { chatId }, '').toPromise() as ApiResponse;
    } catch (error) { }
  }

  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  searchHistory(search: string) {
    this.chats = this.copyChats.filter((item: any) => new RegExp(search, 'i').test(item.fullName));
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  isAdmins() {
    return (this.loggedUser.isAdminProfile || this.loggedUser.isPsychologistProfile)
  }

}
