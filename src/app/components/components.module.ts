import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailVacanciesComponent } from './detail-vacancies/detail-vacancies.component';
import { TruncatePipe } from './truncate-pipe';
import { DialogAlertComponent } from './dialog-alert/dialog-alert.component';
import { PasswordRequirementsComponent } from './password-requirements/password-requirements.component';
import { RouterModule } from '@angular/router';
import { SuccessComponent } from './dialog-alert/success/success.component';
import { ErrorComponent } from './dialog-alert/error/error.component';
import { DetailBlogsComponent } from './detail-blogs/detail-blogs.component';
import { UsernameRequirementsComponent } from './username-requirements/username-requirements.component';
import { DetailAllianceComponent } from './detail-alliance/detail-alliance.component';
import { JoinStringPipe } from './joinstring-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserWiewPostulantComponent } from './user-wiew-postulant/user-wiew-postulant.component';
import { SocialNetworkComponent } from './social-network/social-network.component';
import { YesNotCheckboxComponent } from './yes-not-checkbox/yes-not-checkbox.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RadioButtonComponent } from './radios/radio-button/radio-button.component';
import { ButtonDownloadFilesComponent } from './button-download-files/button-download-files.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { UploadPictureComponent } from './upload-picture/upload-picture.component';
import { ToggleSwitchComponent } from './toggles/toggle-switch/toggle-switch.component';
import { CustomAlertComponent } from './dialog-alert/custom-alert/custom-alert.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CardWithFooterComponent } from './card-with-footer/card-with-footer.component';
import { VideoComponent } from './video/video.component';
import { SaveInterviewComponent } from '../admin/components/calendar/interviews/save-interview/save-interview.component';
import { YoutubeVideoComponent } from './youtube-video/youtube-video.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from './modal/modal.module';
import { CommentComponent } from './comment/comment.component';
import { NgxMaskModule } from 'ngx-mask';
import { SaveTrainingPlanComponent } from '../admin/components/training-plans/save-training-plan/save-training-plan.component';
import { SavePartnerComponent } from '../admin/components/settings/partners/save-partner/save-partner.component';
import { BusinessProfileModalComponent } from '../admin/components/business/business-profile-modal/business-profile-modal.component';
import { PreviewCardComponent } from './preview-card/preview-card.component';
import { EditFpoItemComponent } from '../admin/components/fpo/save-fpo-item/forms/edit-fpo-item/edit-fpo-item.component';
import { CardInformationUserComponent } from './card-information-user/card-information-user.component';
import { ButtonInformationUserComponent } from './button-information-user/button-information-user.component';
import { PreviewDocumentComponent } from './preview-document/preview-document.component';
import { PersonalityTestFormComponent } from '../home/profile-user/personality-test/form/peronality-test-form/personality-test-form.component';
import { UpdateNotificationModalComponent } from '../admin/components/settings/notifications/update-notification-modal/update-notification-modal.component';
import { ChatComponent } from './chat/chat.component';
import { ChatHistoryComponent } from './chat/chat-history/chat-history.component';
import { ChatMessagesComponent } from './chat/chat-messages/chat-messages.component';
import { ChatBotComponent } from './chat/chat-bot/chat-bot.component';
import { InstructionsPtComponent } from '../home/profile-user/personality-test/instructions-pt/instructions-pt.component';
import { PageHeaderModule } from './page-header/page-header.module';
import { CardModule } from './card/card.module';
import { FloatingButtonsModule } from './floating-buttons/floating-buttons.module';
import { ModalQualifyComponent } from './modals/modal-qualify/modal-qualify.component';
import { TabsModule } from './tabs/tabs.module';
import { DirectivesModule } from '../directives/directives.module';
import { ModalQualificationsComponent } from './modals/modal-qualifications/modal-qualifications.component';
import { PaginationModule } from './pagination/pagination.module';
import { CustomSelectModule } from './custom-select/custom-select.module';
import { FieldErrorModule } from './field-error/field-error.module';
import { ModalCurriculumVitaeComponent } from './modals/modal-curriculum-vitae/modal-curriculum-vitae.component';
import { ModalAddCommentsComponent } from './modals/modal-add-comments/modal-add-comments.component';
import { ModalChangePasswordComponent } from './modals/modal-change-password/modal-change-password.component';
import { PaymentModule } from './payment/payment.module';
import { ModalService } from './modal/modal.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TextMaskModule,
    ReactiveFormsModule,
    NgbModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    YouTubePlayerModule,
    NgSelectModule,
    ModalModule,
    PaymentModule,
    PageHeaderModule,
    NgxMaskModule.forRoot(),
    CardModule,
    FloatingButtonsModule,
    TabsModule,
    DirectivesModule,
    PaginationModule,
    CustomSelectModule,
    FieldErrorModule
  ],
  declarations: [
    DetailVacanciesComponent,
    TruncatePipe,
    JoinStringPipe,
    DialogAlertComponent,
    PasswordRequirementsComponent,
    SuccessComponent,
    DetailBlogsComponent,
    ErrorComponent,
    UsernameRequirementsComponent,
    DetailAllianceComponent,
    UserWiewPostulantComponent,
    SocialNetworkComponent,
    YesNotCheckboxComponent,
    RadioButtonComponent,
    ButtonDownloadFilesComponent,
    ProgressBarComponent,
    UploadPictureComponent,
    ToggleSwitchComponent,
    CustomAlertComponent,
    AddCommentComponent,
    CardWithFooterComponent,
    VideoComponent,
    SaveInterviewComponent,
    YoutubeVideoComponent,
    CommentComponent,
    SaveTrainingPlanComponent,
    SavePartnerComponent,
    BusinessProfileModalComponent,
    PreviewCardComponent,
    EditFpoItemComponent,
    CardInformationUserComponent,
    ButtonInformationUserComponent,
    PreviewDocumentComponent,
    PersonalityTestFormComponent,
    UpdateNotificationModalComponent,
    ChatComponent,
    ChatHistoryComponent,
    ChatMessagesComponent,
    ChatBotComponent,
    InstructionsPtComponent,
    ModalQualifyComponent,
    ModalQualificationsComponent,
    ModalCurriculumVitaeComponent,
    ModalAddCommentsComponent,
    ModalAddCommentsComponent,
    ModalChangePasswordComponent,
  ],
  exports: [
    TruncatePipe,
    JoinStringPipe,
    PasswordRequirementsComponent,
    UsernameRequirementsComponent,
    SuccessComponent,
    DetailBlogsComponent,
    ErrorComponent,
    DetailAllianceComponent,
    SocialNetworkComponent,
    YesNotCheckboxComponent,
    RadioButtonComponent,
    ButtonDownloadFilesComponent,
    ProgressBarComponent,
    UploadPictureComponent,
    ToggleSwitchComponent,
    CustomAlertComponent,
    AddCommentComponent,
    CardWithFooterComponent,
    VideoComponent,
    YoutubeVideoComponent,
    PreviewCardComponent,
    CardInformationUserComponent,
    ButtonInformationUserComponent,
    PreviewDocumentComponent,
    ChatComponent,
    ChatHistoryComponent,
    ChatMessagesComponent,
    ChatBotComponent,
    ModalQualifyComponent,
    ModalQualificationsComponent,
    ModalCurriculumVitaeComponent,
    ModalAddCommentsComponent,
    ModalChangePasswordComponent
  ],
  entryComponents: [
    DialogAlertComponent,
    SuccessComponent,
    ErrorComponent,
    CustomAlertComponent,
    SaveInterviewComponent,
    CommentComponent,
    SaveTrainingPlanComponent,
    SavePartnerComponent,
    BusinessProfileModalComponent,
    EditFpoItemComponent,
    PersonalityTestFormComponent,
    UpdateNotificationModalComponent,
    InstructionsPtComponent,
    ModalQualifyComponent,
    ModalQualificationsComponent,
    ModalCurriculumVitaeComponent,
    ModalAddCommentsComponent,
    ModalChangePasswordComponent,
    ModalAddCommentsComponent
  ],
	providers:[ModalService]

})
export class ComponentsModule { }
