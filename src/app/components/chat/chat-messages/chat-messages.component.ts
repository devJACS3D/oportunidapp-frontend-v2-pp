import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { LoggedUser } from "@apptypes/types";
import { Utilities } from "@utils/utilities";
import { Observable, Subscription } from "rxjs";
import { ApiResponse } from "@apptypes/api-response";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { SocketIOService } from "@services/socketIO/socketIO.service";
import { CHATS } from "@apptypes/enums/socket/events/chats";
import { NAMESPACES } from "@apptypes/enums/socket/namespaces";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS } from "src/app/constants/constants";
import { IFile } from "@apptypes/image";
import { UPLOAD } from "@apptypes/enums/uploadFiles";
import { DOWNLOAD_TYPE } from "@apptypes/enums/downloadFiles";
import { SOCKET_IO } from "@apptypes/enums/socket/events/io";
@Component({
  selector: "chat-messages",
  templateUrl: "./chat-messages.component.html",
  styleUrls: ["./chat-messages.component.scss"]
})
export class ChatMessagesComponent implements OnInit {
  @ViewChild("scrollBar") scrollBar: ElementRef;
  @Input() loggedUser: LoggedUser;
  @Input() events: Observable<void>;
  public _currentPage: number = 1;
  public _ItemsPerPage: number = 1000;
  public eventsSubscription: Subscription;
  public chatMessages = [];
  public infoChat: any;
  public utils = Utilities;
  public socketInstance: any;
  public _error: boolean;
  public loadingPage: boolean;
  public loadingMessage: boolean;
  public message: string = "";
  public messageFile: IFile = { Name: "Adjuntar documento" };
  public downloadType = DOWNLOAD_TYPE;

  constructor(
    private api: Api,
    private socket: SocketIOService,
    private alert: DialogService
  ) {}
  /*------------------------------------------------------------------------------------------------------------------------
   Verify if change scrollTop
 --------------------------------------------------------------------------------------------------------------------------*/
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
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
    this.eventsSubscription.unsubscribe();
    this.socket.disconnect(NAMESPACES.CHATS);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  ngOnInit() {
    this.scrollToBottom();
    this.socketInstance = this.socket.of(NAMESPACES.CHATS);
    this.eventsSubscription = this.events.subscribe((infoChat: any) =>
      this.onMessagesList(infoChat)
    );
    this.socket
      .fromEvent(this.socketInstance, CHATS.RECEIVE_MESSAGES)
      .subscribe((data: any) => {
        if (this.infoChat.chatId === data.chatId) {
          this.chatMessages.push(data);
          this.showMessages(data.chatId);
        }
      });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async showMessages(chatId: any) {
    if (!this.isAdmins()) {
      try {
        (await this.api
          .put(Entities.userUpdateChatMessages, { chatId }, "")
          .toPromise()) as ApiResponse;
      } catch (error) {}
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  async onMessagesList(infoChat: any) {
    if (!this.loadingMessage) {
      this.emptyFields();
      this.loadingPage = true;
      try {
        this.infoChat = infoChat;
        this.socket.emit(this.socketInstance, SOCKET_IO.ASSING_TO_ROOM, {
          room: infoChat.uuid
        });
        const entities = this.isAdmins()
          ? Entities.adminChatMessages
          : Entities.userChatMessages;
        const response: ApiResponse = await this.api
          .get(entities, null, this._currentPage, this._ItemsPerPage, {
            chatId: infoChat.chatId
          })
          .toPromise();
        this.chatMessages = response.response;
        this._error = null;
      } catch (error) {
        this._error = error;
      } finally {
        this.loadingPage = false;
      }
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
  
  --------------------------------------------------------------------------------------------------------------------------*/
  async onCreateMessage() {
    if (this.isAdmins() && !this.loadingMessage) {
      this.loadingMessage = true;
      try {
        const { chatId, from, to, uuid } = this.infoChat;
        const body = { message: this.message, chatId, from, to };
        const formData = Utilities.jsonToFormData(body);
        if (this.messageFile.Data)
          formData.append("attachment", this.messageFile.Data);
        const response: ApiResponse = await this.api
          .postData(Entities.adminChatMessages, formData)
          .toPromise();
        let infoChat = response.response;
        infoChat.image = this.loggedUser.image;
        this.socket.emit(this.socketInstance, CHATS.NEW_MESSAGE, {
          room: uuid,
          ...infoChat
        });
        this.scrollToBottom();
        this.emptyFields();
      } catch (error) {
        this.errorAlert(error);
      }
      this.loadingMessage = false;
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  public onUploadDocument() {
    Utilities.onUploadFile((data: any) => {
      if (data.error) return this.warningAlert(data.error);
      this.messageFile = data;
    }, UPLOAD.ALL);
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  messageStyle() {
    return this.isAdmins() ? "send-message" : "received-message";
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  isAdmins() {
    return (
      this.loggedUser.isAdminProfile || this.loggedUser.isPsychologistProfile
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  emptyFields() {
    this.messageFile = { Name: "Adjuntar documento" };
    this.message = "";
  }
  /*------------------------------------------------------------------------------------------------------------------------
    
  --------------------------------------------------------------------------------------------------------------------------*/
  successAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.SUCCESS,
      icon: COLORS.SUCCESS,
      bgBottom: true,
      autoClose: true
    });
  }
  errorAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.DANGER,
      icon: COLORS.WARNING,
      bgTop: true,
      autoClose: true
    });
  }
  warningAlert(message: string) {
    this.alert.customAlert({
      message,
      bgColor: COLORS.WARNING,
      icon: COLORS.WARNING,
      bgTop: true,
      closeButton: true,
      closeBackDrop: true
    });
  }
}
