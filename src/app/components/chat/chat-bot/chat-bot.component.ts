import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from "@angular/core";
import { Utilities } from "@utils/utilities";
import { ApiResponse } from "@apptypes/api-response";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { SocketIOService } from "@services/socketIO/socketIO.service";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { NAMESPACES } from "@apptypes/enums/socket/namespaces";
import { IUser } from "@apptypes/entities/IUser";
import { SOCKET_IO } from "@apptypes/enums/socket/events/io";
import { CHAT_BOT } from "@apptypes/enums/socket/events/chats";
import { Observable } from "rxjs";
import { UserAccountService } from "@services/user-account.service";
import { tap } from "rxjs/operators";

@Component({
  selector: "chat-bot",
  templateUrl: "./chat-bot.component.html",
  styleUrls: ["./chat-bot.component.scss"]
})
export class ChatBotComponent implements OnInit {
  @ViewChild("scrollBar") scrollBar: ElementRef;
  public _currentUser: Observable<any>;
  public loggedUser: IUser;
  public loadingPage: boolean;
  public _error: boolean;
  public utils = Utilities;
  public menuButton: boolean;
  public showChatBot: boolean = false;
  public message: string = "";
  public socketInstance: any;
  public faqs = [];
  public answersFaqs = [];
  public showAnswerFaq: boolean = false;
  public loadingMessage: boolean = false;

  constructor(
    private api: Api,
    private socket: SocketIOService,
    private alert: DialogService,
    private userAccount: UserAccountService
  ) {}
  /*------------------------------------------------------------------------------------------------------------------------
    Verify if change scrollTop
  --------------------------------------------------------------------------------------------------------------------------*/
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    ScrollBottom 
  --------------------------------------------------------------------------------------------------------------------------*/
  scrollToBottom() {
    try {
      this.scrollBar.nativeElement.scrollTop = this.scrollBar.nativeElement.scrollHeight;
    } catch (err) {}
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Disconnect client to socket
  --------------------------------------------------------------------------------------------------------------------------*/
  ngOnDestroy() {
    this.socket.disconnect(NAMESPACES.CHAT_BOT);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Initialize functions
  --------------------------------------------------------------------------------------------------------------------------*/
  ngOnInit() {
    this._currentUser = this.userAccount.getUser$().pipe(
      tap((user) => {
        if(!user) return;
        this.scrollToBottom();
        this.onFaqList();
        this.receiveFromSocket();
      })
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Get list faq and assign to agent to chat bot
  --------------------------------------------------------------------------------------------------------------------------*/
  async onFaqList() {
    this.loadingPage = true;
    try {
      this.socketInstance = this.socket.of(NAMESPACES.CHAT_BOT);
      this.loggedUser = this.userAccount.getUser() as IUser;
      const response: ApiResponse = await this.api
        .get(Entities.userFaqs)
        .toPromise();
      this.faqs = response.response;
      this._error = null;
    } catch (error) {
      this._error = error;
    } finally {
      this.loadingPage = false;
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Send message of faq to server socket.io
  --------------------------------------------------------------------------------------------------------------------------*/
  async onSendFaqMessages(question: string, chatInit: boolean) {
    const data = {
      room: this.loggedUser.identification || this.loggedUser.email,
      name: `${this.loggedUser.firstName} ${this.loggedUser.lastName}`,
      question,
      chatInit
    };
    if (chatInit) {
      this.showAnswerFaq = true;
      this.socket.emit(this.socketInstance, SOCKET_IO.ASSING_TO_ROOM, {
        room: data.room
      });
    }
    this.socket.emit(this.socketInstance, CHAT_BOT.SEND_FAQ, data);
    this.message = "";
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Receive response messages of part of socket.io
  --------------------------------------------------------------------------------------------------------------------------*/
  receiveFromSocket() {
    this.socket
      .fromEvent(this.socketInstance, CHAT_BOT.RECEIVE_ANSWERS_FAQ)
      .subscribe(data => {
        this.answersFaqs.push(data);
        this.scrollToBottom();
      });
    this.socket
      .fromEvent(this.socketInstance, CHAT_BOT.SEND_LOADING)
      .subscribe(({ loading }) => (this.loadingMessage = loading));
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Detecting if press button for menu 
  --------------------------------------------------------------------------------------------------------------------------*/
  onMenuButtons() {
    this.menuButton = !this.menuButton;
    if (!this.menuButton) this.showChatBot = false;
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Verify if press button close chat bot 
  --------------------------------------------------------------------------------------------------------------------------*/
  onCloseChatBot() {
    if (this.showAnswerFaq) {
      this.showAnswerFaq = false;
      this.answersFaqs = [];
    } else {
      this.showChatBot = false;
    }
  }
}
