// import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ErrorHandler, NgModule, LOCALE_ID } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpModule } from "@angular/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./landing/login/login.component";
import { ApiNoAuth } from "./utils/api-no-auth";
import { Api } from "./utils/api";
import { ApiEvaluatest } from "./utils/api-evaluatest";
import { AuthGuard } from "./auth-guard.service";
import { PasswordRecoveryComponent } from "./landing/password-recovery/password-recovery.component";
import { ResetPasswordComponent } from "./landing/reset-password/reset-password.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./home/navbar/navbar.component";
import { VacantesComponent } from "./home/vacantes/vacantes.component";
import { InicioComponent } from "./home/inicio/inicio.component";
import { VacanciesSectionComponent } from "./home/inicio/vacancies-section/vacancies-section.component";
import { ComponentsModule } from "./components/components.module";
import { LoginUserComponent } from "./home/login-user/login-user.component";
import { FooterComponent } from "./home/footer/footer.component";
import { PostsSectionComponent } from "./home/inicio/posts-section/posts-section.component";
import { BlogsComponent } from "./home/blogs/blogs.component";
// import { DetailBlogsComponent } from './home/blogs/detail-blogs/detail-blogs.component';
import { LockSessionComponent } from "./lock-session/lock-session.component";
import { RegisterUserComponent } from "./home/register-user/register-user.component";

import { NgxMaskModule } from "ngx-mask";
import { ProfileUserComponent } from "./home/profile-user/profile-user.component";
import { PersonalInformationComponent } from "./home/profile-user/personal-information/personal-information.component";
import { StudiesComponent } from "./home/profile-user/studies/studies.component";
import { FormStudiesComponent } from "./home/profile-user/studies/form-studies/form-studies.component";
import { ExperiencesComponent } from "./home/profile-user/experiences/experiences.component";
import { FormExperiencesComponent } from "./home/profile-user/experiences/form-experiences/form-experiences.component";
import { UserTestsComponent } from "./home/profile-user/user-tests/user-tests.component";
import { FormUserTestsComponent } from "./home/profile-user/user-tests/form-user-tests/form-user-tests.component";
import { UserVacanciesComponent } from "./home/profile-user/user-vacancies/user-vacancies.component";

import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { CatchMessage } from "@utils/catch-message";
import { CardVacancyComponent } from "./home/vacantes/card-vacancy/card-vacancy.component";
import { RegisterCompanyComponent } from "./business/register-company/register-company.component";
import { AlliancesSectionComponent } from "./home/inicio/alliances-section/alliances-section.component";
import { AlliancesPageComponent } from "./home/alliances-page/alliances-page.component";
import { CardAllianceComponent } from "./home/alliances-page/card-alliance/card-alliance.component";
import { TextMaskModule } from "angular2-text-mask";
import { PriceComponent } from "./home/price/price.component";
import { PlanComplementComponent } from "./home/price/plan-complement/plan-complement.component";
import { ModalPaymentPlanComponent } from "./home/price/modal-payment-plan/modal-payment-plan.component";
import { FiguresComponent } from "./admin/components/figures/figures.component";
import { BenefitsComponent } from "./home/benefits/benefits.component";
import { PostulantComponent } from "./home/postulant/postulant.component";
import { CardPostulantsComponent } from "./home/postulant/card-postulants/card-postulants.component";
import { UserInterviewesComponent } from "./home/profile-user/user-interviewes/user-interviewes.component";
import { FormReferencesComponent } from "./home/profile-user/personal-information/form-references/form-references.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { InterviewsComponent } from "./home/profile-user/interviews/interviews.component";
import { UsersInterviewsComponent } from "./home/profile-user/interviews/users-interviews/users-interviews.component";
import { UsersPreinterviewsComponent } from "./home/profile-user/interviews/users-preinterviews/users-preinterviews.component";
import { ModalQuestionComponent } from "./home/profile-user/interviews/users-preinterviews/modal-question/modal-question.component";
import { ModalVideoComponent } from "./home/profile-user/interviews/users-preinterviews/modal-video/modal-video.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CacheInterceptor } from "@services/interceptors/cacheInterceptor.interceptor";
import { PartnersPageComponent } from "./home/partners/partners-page/partners-page.component";
import { PartnersPageListComponent } from "./home/partners/partners-page-list/partners-page-list.component";
import { BusinessPageComponent } from "./home/business/business-page/business-page.component";
import { ClientsPageComponent } from "./home/clients/clients-page/clients-page.component";
import { ClientsPageListComponent } from "./home/clients/clients-page-list/clients-page-list.component";
import { GlobalErrorHandlerService } from "@services/global-error-handler.service";
import { NgbDateCustomParserFormatter } from "@utils/dateformat";
import { NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
import { PersonalityTestComponent } from "./home/profile-user/personality-test/personality-test.component";
import { ChartsModule } from "ng2-charts";

/* ................................................................................................. */
/* NGX SOCKET IO CONFIG */
/* ................................................................................................. */
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { PrintLayoutComponent } from "./printables/print-layout/print-layout.component";
import { PrintPersonalityTestComponent } from "./printables/print-personality-test/print-personality-test.component";
import { BarsPtComponent } from "./printables/print-personality-test/bars-pt/bars-pt.component";
import { PrintPsychotechnicalTestComponent } from "./printables/print-psychotechnical-test/print-psychotechnical-test.component";
import { environment } from "src/environments/environment";
import { PaginationModule } from "./components/pagination/pagination.module";
import { PageHeaderModule } from "./components/page-header/page-header.module";
import { CardModule } from "./components/card/card.module";
import { FloatingButtonsModule } from "./components/floating-buttons/floating-buttons.module";
import { ConfirmationModule } from "./components/confirmation/confirmation.module";
import { TabsModule } from "./components/tabs/tabs.module";
import { DirectivesModule } from "./directives/directives.module";
import { PrintInterviewComponent } from "./printables/print-interview/print-interview.component";
import { PrintWorkReferencesComponent } from "./printables/print-work-references/print-work-references.component";
import { FieldErrorModule } from "./components/field-error/field-error.module";
import { BlogModule } from "./pages/blog/blog.module";
import { PrintPreInterviewComponent } from "./printables/print-pre-interview/print-pre-interview.component";
import { PrintJudicialBackgroundComponent } from "./printables/print-judicial-background/print-judicial-background.component";
import { SuccessCaseModule } from "./pages/success-case/success-case.module";
import { ModalModule } from "./components/modal/modal.module";
import { PaymentModule } from "./components/payment/payment.module";
import { ModalService } from "./components/modal/modal.service";
const config: SocketIoConfig = {
  url: environment.apiHost,
  options: { transports: ["websocket"] }
};

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PasswordRecoveryComponent,
    ResetPasswordComponent,
    HomeComponent,
    NavbarComponent,
    VacantesComponent,
    InicioComponent,
    VacanciesSectionComponent,
    LoginUserComponent,
    FooterComponent,
    PostsSectionComponent,
    BlogsComponent,
    // DetailBlogsComponent,
    LockSessionComponent,
    RegisterUserComponent,
    ProfileUserComponent,
    PersonalInformationComponent,
    StudiesComponent,
    FormStudiesComponent,
    ExperiencesComponent,
    FormExperiencesComponent,
    UserTestsComponent,
    FormUserTestsComponent,
    UserVacanciesComponent,
    CardVacancyComponent,
    RegisterCompanyComponent,
    AlliancesSectionComponent,
    AlliancesPageComponent,
    CardAllianceComponent,
    PriceComponent,
    FiguresComponent,
    PlanComplementComponent,
    ModalPaymentPlanComponent,
    BenefitsComponent,
    PostulantComponent,
    CardPostulantsComponent,
    UserInterviewesComponent,
    FormReferencesComponent,
    InterviewsComponent,
    UsersInterviewsComponent,
    UsersPreinterviewsComponent,
    ModalQuestionComponent,
    ModalVideoComponent,
    PartnersPageComponent,
    PartnersPageListComponent,
    BusinessPageComponent,
    ClientsPageComponent,
    ClientsPageListComponent,
    PersonalityTestComponent,
    PrintLayoutComponent,
    PrintPersonalityTestComponent,
    BarsPtComponent,
    PrintPsychotechnicalTestComponent,
    PrintInterviewComponent,
    PrintWorkReferencesComponent,
    PrintPreInterviewComponent,
    PrintJudicialBackgroundComponent
  ],
  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ComponentsModule,
    TextMaskModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    AngularEditorModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    ChartsModule,
    PaginationModule,
    PageHeaderModule,
    CardModule,
    FloatingButtonsModule,
    ConfirmationModule,
    TabsModule,
    DirectivesModule,
    FieldErrorModule,
    BlogModule,
    SuccessCaseModule,
    ModalModule,
    PaymentModule
  ],
  providers: [
    Api,
    ApiEvaluatest,
    ApiNoAuth,
    AuthGuard,
    CatchMessage,
    ModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: "es-ES" },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
