import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { SidebarItemComponent } from "./layout/sidebar/sidebar-item/sidebar-item.component";
import { SidebarGroupComponent } from "./layout/sidebar/sidebar-group/sidebar-group.component";
import { ComponentsModule } from "../components/components.module";
import { SectorsComponent } from "./components/sectors/sectors.component";
import { FormSectorsComponent } from "./components/sectors/form-sectors/form-sectors.component";
import { AdditionalsServicesComponent } from "./components/additionals-services/additionals-services.component";
import { FormAdditionalsServicesComponent } from "./forms/form-additionals-services/form-additionals-services.component";
import { TestsComponent } from "./components/tests/tests.component";
import { FormTestsComponent } from "./forms/form-tests/form-tests.component";
import { RegisteredTestsComponent } from "./components/tests/registered-tests/registered-tests.component";
import { ItemTestSkillComponent } from "./forms/form-tests/item-test-skill/item-test-skill.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TextMaskModule } from "angular2-text-mask";
import { VacanciesComponent } from "./components/vacancies/vacancies.component";
import { FormVacanciesComponent } from "./forms/form-vacancies/form-vacancies.component";
import { UsersComponent } from "./components/users/users.component";
import { FormUsersComponent } from "./forms/form-users/form-users.component";
import { DetailAdditionalsServicesComponent } from "./components/additionals-services/detail-additionals-services/detail-additionals-services.component";
import { ProfileComponent } from "./profile/profile.component";
import { SuccessStoriesComponent } from "./components/success-stories/success-stories.component";
import { FormSuccessStoriesComponent } from "./forms/form-success-stories/form-success-stories.component";
import { BlogListComponent } from "./components/blog-list/blog-list.component";
import { FormBlogsComponent } from "./forms/form-blogs/form-blogs.component";
import { CalendarComponent } from "./components/calendar/calendar.component";

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";

import { HttpClientModule } from "@angular/common/http";
import { CalendarHeaderComponent } from "./components/calendar/calendar-header/calendar-header.component";
import { FormInterviewComponent } from "./forms/form-interview/form-interview.component";
import { TestCalendarComponent } from "./components/test-calendar/test-calendar.component";
import { UserViewComponent } from "./components/user-view/user-view.component";
import { CandidatesComponent } from "./components/candidates/candidates.component";
import { FinishedTestsComponent } from "./components/tests/finished-tests/finished-tests.component";
import { TestViewComponent } from "./components/tests/test-view/test-view.component";
import { CheckTestComponent } from "./components/tests/check-test/check-test.component";
import { NgxMaskModule } from "ngx-mask";
import { SuccessStoryDetailComponent } from "./components/success-stories/success-story-detail/success-story-detail.component";
import { BlogDetailComponent } from "./components/blog-list/blog-detail/blog-detail.component";
import { CompanyProfileComponent } from "./company/company-profile/company-profile.component";
import { ModalPaymentComponent } from "./forms/form-vacancies/modal-payment/modal-payment.component";
import { StatisticsComponent } from "./components/statistics/statistics.component";

import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule } from "ng2-charts";

import { BehaviorsComponent } from "./components/behaviors/behaviors.component";
import { FormBehaviorsComponent } from "./forms/form-behaviors/form-behaviors.component";
import { ItemBehaviorsComponent } from "./forms/form-behaviors/item-behaviors/item-behaviors.component";
import { ItemTestBehaviorsComponent } from "./forms/form-tests/item-test-behaviors/item-test-behaviors.component";
import { FormOrdersComponent } from "./forms/form-orders/form-orders.component";
import { MembershipComponent } from "./components/membership/membership.component";
import { FormMembershipComponent } from "./form/form-membership/form-membership.component";
import { CompanyComponent } from "./components/company/company.component";
import { FormCompanyComponent } from "./forms/form-company/form-company.component";
import { CostComponent } from "./components/cost/cost.component";
import { FormCostComponent } from "./forms/form-cost/form-cost.component";
import { CompaiesLogisComponent } from "./components/compaies-logis/compaies-logis.component";
import { FormCompaniesLogisComponent } from "./forms/form-companies-logis/form-companies-logis.component";
import { FormUserLogisComponent } from "./forms/form-user-logis/form-user-logis.component";
import { FormOrderComponent } from "./forms/form-order/form-order.component";
import { FormReportComponent } from "./forms/form-report/form-report.component";
import { FormReportPsychologicalComponent } from "./forms/form-report-psychological/form-report-psychological.component";
import { FormReportInterviewComponent } from "./forms/form-report-interview/form-report-interview.component";
import { CardItemsComponent } from "./components/card-items/card-items.component";
import { PostulatesComponent } from "./components/postulates/postulates.component";
import { CreateComponent } from "./components/vacancies/create/create.component";
import { GeneralFormComponent } from "./components/vacancies/forms/general-form/general-form.component";
import { AdditionalServicesFormComponent } from "./components/vacancies/forms/additional-services-form/additional-services-form.component";
import { OfferDetailsComponent } from "./components/vacancies/forms/offer-details/offer-details.component";
import { OfferRequerimentsComponent } from "./components/vacancies/forms/offer-requeriments/offer-requeriments.component";
import { VacancieCardDetailComponent } from "./components/vacancies/vacancie-card-detail/vacancie-card-detail.component";
import { TestsFormComponent } from "./components/vacancies/forms/tests-form/tests-form.component";
import { PreinterviewsComponent } from "./components/preinterviews/preinterviews.component";
import { PreinterviewsFormComponent } from "./components/preinterviews/forms/preinterviews-form/preinterviews-form.component";
import { SaveUserComponent } from "./components/users/save-user/save-user.component";
import { UserFormComponent } from "./components/users/forms/user-form/user-form.component";
import { SwiperModule } from "ngx-swiper-wrapper";
import { UserListComponent } from "./components/users/user-list/user-list.component";
import { VacanciesListComponent } from "./components/vacancies/vacancies-list/vacancies-list.component";
import { PreinterviewsListComponent } from "./components/preinterviews/preinterviews-list/preinterviews-list.component";
import { ServiceTypeConfigComponent } from "./components/settings/service-type-config/service-type-config.component";
import { SettingsComponent } from "./components/settings/settings/settings.component";
import { ServiceTypeConfigListComponent } from "./components/settings/service-type-config/service-type-config-list/service-type-config-list.component";
import { CandidatesListComponent } from "./components/candidates/candidates-list/candidates-list.component";
import { PersonalInformationComponent } from "./components/user-view/personal-information/personal-information.component";
import { PersonalReferenceComponent } from "./components/user-view/personal-reference/personal-reference.component";
import { AdditionalDataComponent } from "./components/user-view/additional-data/additional-data.component";
import { AcademicInformationComponent } from "./components/user-view/academic-information/academic-information.component";
import { WorkHistoryComponent } from "./components/user-view/work-history/work-history.component";
import { UserSideCardComponent } from "./components/user-view/user-side-card/user-side-card.component";
import { ValidateReferenceModalComponent } from "./components/user-view/validate-reference-modal/validate-reference-modal.component";
import { SectorListComponent } from "./components/sectors/sector-list/sector-list.component";
import { BehavioursComponent } from "./components/behaviours/behaviours.component";
import { BehaviourListComponent } from "./components/behaviours/behaviour-list/behaviour-list.component";
import { SaveBehaviourComponent } from "./components/behaviours/save-behaviour/save-behaviour.component";
import { BehaviourFormComponent } from "./components/behaviours/forms/behaviour-form/behaviour-form.component";
import { SaveTestComponent } from "./components/tests/save-test/save-test.component";
import { TestGeneralAspectsComponent } from "./components/tests/forms/test-general-aspects/test-general-aspects.component";
import { TestQuestionsComponent } from "./components/tests/forms/test-questions/test-questions.component";
import { TestFeedbacksComponent } from "./components/tests/forms/test-feedbacks/test-feedbacks.component";
import { PreinterviewsUsersComponent } from "./components/preinterviews-users/preinterviews-users.component";
import { PreinterviewsUsersListComponent } from "./components/preinterviews-users/preinterviews-users-list/preinterviews-users-list.component";
import { PreinterviewsApprovedComponent } from "./components/preinterviews-users/forms/preinterviews-approved/preinterviews-approved.component";
import { PreinterviewsRejectedComponent } from "./components/preinterviews-users/forms/preinterviews-rejected/preinterviews-rejected.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { TrainingPlansComponent } from "./components/training-plans/training-plans.component";
import { TrainingPlanListComponent } from "./components/training-plans/training-plan-list/training-plan-list.component";
import { RequisitionsComponent } from "./components/requisitions/requisitions.component";
import { RequisitionListComponent } from "./components/requisitions/requisition-list/requisition-list.component";
import { InterviewsComponent } from "./components/calendar/interviews/interviews.component";
import { ValidateJudicialReferenceModalComponent } from "./components/user-view/validate-judicial-reference-modal/validate-judicial-reference-modal.component";
import { SocialNetworksComponent } from "./components/social-networks/social-networks.component";
import { BusinessComponent } from "./components/business/business.component";
import { BusinessProfileComponent } from "./components/business/business-profile/business-profile.component";
import { BusinessProfileFormComponent } from "./components/business/business-profile/business-profile-form/business-profile-form.component";
import { BusinessPlansComponent } from "./components/business/business-plans/business-plans.component";
import { BusinessPurchasesComponent } from "./components/business/business-purchases/business-purchases.component";
import { PartnersComponent } from "./components/settings/partners/partners.component";
import { PartnerListComponent } from "./components/settings/partners/partner-list/partner-list.component";
import { BusinessListComponent } from "./components/business/business-list/business-list.component";
import { FPOComponent } from "./components/fpo/fpo.component";
import { FPOListComponent } from "./components/fpo/fpo-list/fpo-list.component";
import { SaveFPOComponent } from "./components/fpo/save-fpo/save-fpo.component";
import { FPOItemListComponent } from "./components/fpo/fpo-item-list/fpo-item-list.component";
import { SaveFPOItemComponent } from "./components/fpo/save-fpo-item/save-fpo-item.component";
import { SaveFpoFormComponent } from "./components/fpo/save-fpo/forms/save-fpo-form/save-fpo-form.component";
import { SaveFpoItemFormComponent } from "./components/fpo/save-fpo-item/forms/save-fpo-item-form/save-fpo-item-form.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { PersonalityTestPageComponent } from "./components/personality-test/personality-test-page/personality-test-page.component";
import { PersonalityTestListComponent } from "./components/personality-test/personality-test-list/personality-test-list.component";
import { PipesModule } from "../pipes/pipes.module";
import { NotificationsComponent } from "./components/settings/notifications/notifications.component";
import { VappStatusModule } from "../components/vapp-status/vapp-status.module";
import { PageHeaderModule } from "../components/page-header/page-header.module";
import { FiltersModule } from "../components/filters/filters.module";
import { AsyncSelectModule } from "../components/async-select/async-select.module";
import { PaginationModule } from "../components/pagination/pagination.module";
import { CardModule } from "../components/card/card.module";
import { FloatingButtonsModule } from "../components/floating-buttons/floating-buttons.module";
import { ConfirmationModule } from "../components/confirmation/confirmation.module";
import { TabsModule } from "../components/tabs/tabs.module";
import { DirectivesModule } from "../directives/directives.module";
import { FieldErrorModule } from "../components/field-error/field-error.module";
import { UserReportsButtonsComponent } from "./components/user-view/user-reports-buttons/user-reports-buttons.component";
import { PreinterviewsVideoComponent } from "./components/preinterviews-users/preinterviews-video/preinterviews-video.component";
import { ModalModule } from "../components/modal/modal.module";
import { PaymentModule } from "../components/payment/payment.module";
import { ModalService } from "../components/modal/modal.service";
import { VacanteExisEmpresaComponent } from "./components/vacancies/forms/vacante-exis-empresa/vacante-exis-empresa.component";
import { InfComparativoComponent } from './components/candidates/inf-comparativo/inf-comparativo.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    // BrowserAnimationsModule,
    AdminRoutingModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    NgbModule,
    NgSelectModule,
    TextMaskModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxMaskModule.forRoot(),

    NgxEchartsModule,
    ChartsModule,
    AngularEditorModule,
    PipesModule,
    VappStatusModule,
    PageHeaderModule,
    FiltersModule,
    AsyncSelectModule,
    PaginationModule,
    CardModule,
    FloatingButtonsModule,
    VappStatusModule,
    ConfirmationModule,
    TabsModule,
    DirectivesModule,
    FieldErrorModule,
    ModalModule,
    PaymentModule
  ],
  declarations: [
    AdminComponent,
    NavbarComponent,
    SidebarComponent,
    SidebarItemComponent,
    SidebarGroupComponent,
    SectorsComponent,
    FormSectorsComponent,
    AdditionalsServicesComponent,
    FormAdditionalsServicesComponent,
    TestsComponent,
    FormTestsComponent,
    RegisteredTestsComponent,
    ItemTestSkillComponent,
    VacanciesComponent,
    FormVacanciesComponent,
    UsersComponent,
    FormUsersComponent,
    DetailAdditionalsServicesComponent,
    ProfileComponent,
    SuccessStoriesComponent,
    FormSuccessStoriesComponent,
    BlogListComponent,
    FormBlogsComponent,
    CalendarComponent,
    CalendarHeaderComponent,
    FormInterviewComponent,
    TestCalendarComponent,
    UserViewComponent,
    CandidatesComponent,
    FinishedTestsComponent,
    TestViewComponent,
    CheckTestComponent,
    SuccessStoryDetailComponent,
    BlogDetailComponent,
    CompanyProfileComponent,
    ModalPaymentComponent,
    StatisticsComponent,
    BehaviorsComponent,
    FormBehaviorsComponent,
    ItemBehaviorsComponent,
    ItemTestBehaviorsComponent,
    FormOrdersComponent,
    MembershipComponent,
    FormMembershipComponent,
    CompanyComponent,
    FormCompanyComponent,
    CostComponent,
    FormCostComponent,
    CompaiesLogisComponent,
    FormCompaniesLogisComponent,
    FormUserLogisComponent,
    FormOrderComponent,
    FormReportComponent,
    FormReportPsychologicalComponent,
    FormReportInterviewComponent,
    CardItemsComponent,
    PostulatesComponent,
    CreateComponent,
    GeneralFormComponent,
    AdditionalServicesFormComponent,
    OfferDetailsComponent,
    OfferRequerimentsComponent,
    VacancieCardDetailComponent,
    TestsFormComponent,
    PreinterviewsComponent,
    PreinterviewsFormComponent,
    SaveUserComponent,
    UserFormComponent,
    UserListComponent,
    VacanciesListComponent,
    PreinterviewsListComponent,
    ServiceTypeConfigComponent,
    SettingsComponent,
    ServiceTypeConfigListComponent,
    CandidatesListComponent,
    PersonalInformationComponent,
    PersonalReferenceComponent,
    AdditionalDataComponent,
    AcademicInformationComponent,
    WorkHistoryComponent,
    UserSideCardComponent,
    ValidateReferenceModalComponent,
    SectorListComponent,
    BehavioursComponent,
    BehaviourListComponent,
    SaveBehaviourComponent,
    BehaviourFormComponent,
    SaveTestComponent,
    TestGeneralAspectsComponent,
    TestQuestionsComponent,
    TestFeedbacksComponent,
    PreinterviewsUsersComponent,
    PreinterviewsUsersListComponent,
    PreinterviewsApprovedComponent,
    PreinterviewsRejectedComponent,
    TrainingPlansComponent,
    TrainingPlanListComponent,
    RequisitionsComponent,
    RequisitionListComponent,
    InterviewsComponent,
    ValidateJudicialReferenceModalComponent,
    SocialNetworksComponent,
    BusinessComponent,
    BusinessProfileComponent,
    BusinessProfileFormComponent,
    BusinessPlansComponent,
    BusinessPurchasesComponent,
    PartnersComponent,
    PartnerListComponent,
    BusinessListComponent,
    FPOComponent,
    FPOListComponent,
    SaveFPOComponent,
    FPOItemListComponent,
    SaveFPOItemComponent,
    SaveFpoFormComponent,
    SaveFpoItemFormComponent,
    PersonalityTestPageComponent,
    PersonalityTestListComponent,
    NotificationsComponent,
    UserReportsButtonsComponent,
    PreinterviewsVideoComponent,
    VacanteExisEmpresaComponent,
    InfComparativoComponent
  ],
  providers: [ModalService]
})
export class AdminModule {}
