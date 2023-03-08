import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { SectorsComponent } from "./components/sectors/sectors.component";
import { FormSectorsComponent } from "./components/sectors/form-sectors/form-sectors.component";
import { AdditionalsServicesComponent } from "./components/additionals-services/additionals-services.component";
import { FormAdditionalsServicesComponent } from "./forms/form-additionals-services/form-additionals-services.component";
import { TestsComponent } from "./components/tests/tests.component";
import { FormTestsComponent } from "./forms/form-tests/form-tests.component";
import { RegisteredTestsComponent } from "./components/tests/registered-tests/registered-tests.component";
import { VacanciesComponent } from "./components/vacancies/vacancies.component";
import { UsersComponent } from "./components/users/users.component";
import { FormUsersComponent } from "./forms/form-users/form-users.component";
import { DetailVacanciesComponent } from "../components/detail-vacancies/detail-vacancies.component";
import { ProfileComponent } from "./profile/profile.component";
import { SuccessStoriesComponent } from "./components/success-stories/success-stories.component";
import { FormSuccessStoriesComponent } from "./forms/form-success-stories/form-success-stories.component";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { UserViewComponent } from "./components/user-view/user-view.component";
import { CandidatesComponent } from "./components/candidates/candidates.component";
import { FinishedTestsComponent } from "./components/tests/finished-tests/finished-tests.component";
import { TestViewComponent } from "./components/tests/test-view/test-view.component";
import { SuccessStoryDetailComponent } from "./components/success-stories/success-story-detail/success-story-detail.component";
import { CompanyProfileComponent } from "./company/company-profile/company-profile.component";
import { CreateComponent } from "./components/vacancies/create/create.component";
import { VacancyResolverService } from "@services/resolvers/vacancy-resolver.service";
import { PreinterviewsComponent } from "./components/preinterviews/preinterviews.component";
import { PreinterviewsFormComponent } from "./components/preinterviews/forms/preinterviews-form/preinterviews-form.component";
import { SaveUserComponent } from "./components/users/save-user/save-user.component";
import { UserResolverService } from "@services/resolvers/user-resolver.service";
import { UserListComponent } from "./components/users/user-list/user-list.component";
import { VacancyApplymentStatusListComponent } from "./components/vacancy-applyment-status/vacancy-applyment-status-list/vacancy-applyment-status-list.component";
import { VacanciesListComponent } from "./components/vacancies/vacancies-list/vacancies-list.component";
import { PreinterviewsListComponent } from "./components/preinterviews/preinterviews-list/preinterviews-list.component";
import { SettingsComponent } from "./components/settings/settings/settings.component";
import { ServiceTypeConfigComponent } from "./components/settings/service-type-config/service-type-config.component";
import { BusinessTypesResolverService } from "@services/resolvers/businessTypes.service";
import { ServiceTypeConfigListComponent } from "./components/settings/service-type-config/service-type-config-list/service-type-config-list.component";
import { ServiceTypeConfigResolverService } from "@services/resolvers/serviceTypeConfig.service";
import { CandidatesListComponent } from "./components/candidates/candidates-list/candidates-list.component";
import { VacancyApplymentUserResolverService } from "@services/resolvers/vacancyApplymentUser.service";
import { SectorListComponent } from "./components/sectors/sector-list/sector-list.component";
import { SectorResolverService } from "@services/resolvers/sectors.service";
import { BehavioursComponent } from "./components/behaviours/behaviours.component";
import { BehaviourListComponent } from "./components/behaviours/behaviour-list/behaviour-list.component";
import { SaveBehaviourComponent } from "./components/behaviours/save-behaviour/save-behaviour.component";
import { TestsResolverService } from "@services/resolvers/tests.service";
import { SaveTestComponent } from "./components/tests/save-test/save-test.component";
import { PreinterviewsUsersComponent } from "./components/preinterviews-users/preinterviews-users.component";
import { PreinterviewsUsersListComponent } from "./components/preinterviews-users/preinterviews-users-list/preinterviews-users-list.component";
import { TestAnswersResolverService } from "@services/resolvers/testAnswers.service";
import { TrainingPlansComponent } from "./components/training-plans/training-plans.component";
import { TrainingPlanListComponent } from "./components/training-plans/training-plan-list/training-plan-list.component";
import { RequisitionsComponent } from "./components/requisitions/requisitions.component";
import { RequisitionListComponent } from "./components/requisitions/requisition-list/requisition-list.component";
import { RequisitionsResolverService } from "@services/resolvers/requisitions.service";
import { InterviewsComponent } from "./components/calendar/interviews/interviews.component";
import { SocialNetworksComponent } from "./components/social-networks/social-networks.component";
import { BusinessComponent } from "./components/business/business.component";
import { BusinessProfileComponent } from "./components/business/business-profile/business-profile.component";
import { BusinessResolverService } from "@services/resolvers/business.service";
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
import { FactorResolverService } from "@services/resolvers/factor.service";
import { PersonalityTestPageComponent } from "./components/personality-test/personality-test-page/personality-test-page.component";
import { PersonalityTestListComponent } from "./components/personality-test/personality-test-list/personality-test-list.component";
import { NotificationsComponent } from "./components/settings/notifications/notifications.component";
import { ChatComponent } from "../components/chat/chat.component";
import { SkillResolverService } from "@services/resolvers/skills.service";
// import { DetailVacanciesComponent } from './components/vacancies/detail-vacancies/detail-vacancies.component';

const routes: Routes = [
  { path: "", redirectTo: "vacancies", pathMatch: "full" },
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "profile", component: ProfileComponent },
      { path: "company-profile", component: CompanyProfileComponent },

      {
        path: "applyment/:status/:title",
        component: VacancyApplymentStatusListComponent
      },
      /* ................................................................................................. */
      /* CALENDAR ROUTES */
      /* ................................................................................................. */
      {
        path: "calendar",
        component: CalendarComponent,
        children: [
          {
            path: "",
            component: InterviewsComponent
          }
        ]
        /*  children: [
           { path: 'interview/create', component: FormInterviewComponent },
           { path: 'interview/:id', component: FormInterviewComponent },
           { path: 'user-view/:id', component: UserViewComponent }
         ] */
      },
      // Behaviour routes
      {
        path: "behaviours",
        component: BehavioursComponent,
        children: [
          {
            path: "",
            component: BehaviourListComponent,
            resolve: {
              skills: SkillResolverService
            }
          },
          {
            path: "create/:skillId",
            component: SaveBehaviourComponent,
            resolve: {
              skill: SkillResolverService
            }
          },
          {
            path: "edit/:skillId",
            component: SaveBehaviourComponent,
            resolve: {
              skill: SkillResolverService
            }
          }
        ]
      },
      { path: "success-stories", component: SuccessStoriesComponent },
      { path: "success-stories/:page", component: SuccessStoriesComponent },
      {
        path: "success-stories/:page/:numRecords",
        component: SuccessStoriesComponent,
        children: [
          {
            path: "form-success-stories",
            component: FormSuccessStoriesComponent
          },
          {
            path: "form-success-stories/:id",
            component: FormSuccessStoriesComponent
          }
        ]
      },
      {
        path: "success-story-detail/:id",
        component: SuccessStoryDetailComponent
      },

      {
        path: "users",
        component: UsersComponent,
        children: [
          { path: "", component: UserListComponent },
          { path: "create", component: SaveUserComponent },
          {
            path: "edit/:id",
            component: SaveUserComponent,
            resolve: {
              user: UserResolverService
            }
          },
          { path: "form-users/:id", component: FormUsersComponent }
        ]
      },
      /* ................................................................................................. */
      /*  SETTINGS ROUTES */
      /* ................................................................................................. */
      {
        path: "settings",
        component: SettingsComponent,
        children: [
          {
            path: "serviceType",
            component: ServiceTypeConfigComponent,
            resolve: {
              businessTypes: BusinessTypesResolverService
            },
            children: [
              {
                path: ":businessTypeId",
                component: ServiceTypeConfigListComponent,
                resolve: {
                  servicesTypeConfigs: ServiceTypeConfigResolverService
                }
              },
              {
                path: "",
                redirectTo: "serviceType/1",
                pathMatch: "full"
              }
            ]
          },
          {
            //code here
            path: "partners",
            component: PartnersComponent,
            children: [
              {
                path: "",
                component: PartnerListComponent
              }
            ]
          },
          {
            path: "notifications",
            component: NotificationsComponent
          },
          {
            path: "",
            redirectTo: "serviceType/1",
            pathMatch: "full"
          }
        ]
      },
      // Sectors routes
      {
        path: "sectors",
        component: SectorsComponent,
        children: [
          {
            path: "",
            component: SectorListComponent,
            resolve: {
              sectors: SectorResolverService
            }
          },
          { path: "create", component: FormSectorsComponent },
          { path: "edit/:id", component: FormSectorsComponent }
        ]
      },
      { path: "additionals-services", component: AdditionalsServicesComponent },
      {
        path: "additionals-services:/page",
        component: AdditionalsServicesComponent
      },
      {
        path: "additionals-services/:page/:numRecords",
        component: AdditionalsServicesComponent,
        children: [
          {
            path: "form-additionals-services",
            component: FormAdditionalsServicesComponent
          },
          {
            path: "form-additionals-services/:id",
            component: FormAdditionalsServicesComponent
          }
        ]
      },

      /* ................................................................................................. */
      /* Tests routes */
      /* ................................................................................................. */
      {
        path: "tests",
        component: TestsComponent,
        children: [
          {
            path: "",
            component: RegisteredTestsComponent,
            resolve: {
              tests: TestsResolverService
            }
          },
          { path: "create", component: SaveTestComponent },
          {
            path: "edit/:id",
            component: SaveTestComponent,
            resolve: {
              test: TestsResolverService
            }
          },
          {
            path: "detail",
            component: TestViewComponent,
            resolve: {
              test: TestAnswersResolverService
            }
          },
          {
            path: "users/:done",
            component: FinishedTestsComponent,
            resolve: {
              tests: TestsResolverService
            }
          },
          // { path: 'test-view/:vacancyId/:testId/:userId', component: TestViewComponent },
          // { path: 'user-view/:id', component: UserViewComponent },

          { path: "create-test", component: FormTestsComponent }
        ]
      },

      /* ................................................................................................. */
      /* Personality tests routes */
      /* ................................................................................................. */
      {
        path: "personalityTests",
        component: PersonalityTestPageComponent,
        children: [
          {
            path: "",
            component: PersonalityTestListComponent
          }
        ]
      },
      /* ................................................................................................. */
      /* Training plans routes */
      /* ................................................................................................. */
      {
        path: "trainingPlans",
        component: TrainingPlansComponent,
        children: [
          {
            path: "",
            component: TrainingPlanListComponent
          }
        ]
      },
      /* ................................................................................................. */
      /* VACANCIES ROUTES */
      /* ................................................................................................. */

      {
        path: "vacancies",
        component: VacanciesComponent,
        children: [
          { path: "", component: VacanciesListComponent },
          { path: "create", component: CreateComponent },
          { path: "detail/:id/:vac", component: DetailVacanciesComponent },
          {
            path: "edit/:id",
            component: CreateComponent,
            resolve: {
              vacancy: VacancyResolverService
            }
          }
        ]
      },
      /* ................................................................................................. */
      /* REQUISITIONS ROUTES */
      /* ................................................................................................. */
      {
        path: "requisitions",
        component: RequisitionsComponent,
        children: [
          {
            path: "",
            component: RequisitionListComponent,
            resolve: {
              requisitions: RequisitionsResolverService
            }
          },
          { path: "create", component: CreateComponent },
          { path: "detail/:id", component: DetailVacanciesComponent },
          {
            path: "edit/:id",
            component: CreateComponent,
            resolve: {
              vacancy: VacancyResolverService
            }
          }
        ]
      },

      /* ................................................................................................. */
      /* CANDIDATES ROUTES */
      /* ................................................................................................. */
      {
        path: "candidates",
        component: CandidatesComponent,
        children: [
          {
            path: "va/:status/:vid/:title/:vac",
            component: CandidatesListComponent
          },
          {
            path: "user/:vaid/:vac/:id",
            component: UserViewComponent,
            resolve: {
              vacancyApplyment: VacancyApplymentUserResolverService
            }
          },
          {
            path: "",
            redirectTo: "vacancies",
            pathMatch: "full"
          }
        ]
      },

      /* { path: 'form-vacancies', component: FormVacanciesComponent },

      { path: 'form-vacancies/:id', component: FormVacanciesComponent },

      { path: 'candidates/:id/:fit', component: CandidatesComponent },
      { path: 'candidates/form-order', component: FormOrderComponent },
      { path: 'candidates/:id/:fit/form-order', component: FormOrderComponent },
      { path: 'candidates/:id/:fit/form-order/:vacancyId/:id', component: FormOrderComponent },
      { path: 'candidates/:id/:fit/form-report/:vacancyId/:id', component: FormReportComponent },
      { path: 'candidates/:id/:fit/form-report-psychological/:vacancyId/:id', component: FormReportPsychologicalComponent },
      { path: 'candidates/:id/:fit/form-report-interview/:vacancyId/:id', component: FormReportInterviewComponent }, */

      /* {
        path: 'candidates/:id/:fit/:page/:numRecords',
        component: CandidatesComponent,
        children: [
          { path: 'user-view/:id', component: UserViewComponent },
          {
            path: 'user-view/:id/:vacancyId', component: UserViewComponent,
            children: [
              { path: 'form-order', component: FormOrderComponent }
            ]
          },
          {
            path: 'user-view/:id/:vacancyId/form-order', component: UserViewComponent,
          }
        ]
      },

      { path: 'orders', component: FormOrdersComponent },
      { path: 'orders/:page', component: FormOrdersComponent },
      {
        path: 'orders/:page/:numRecords',
        component: FormOrdersComponent,
      },
      { path: 'statistics', component: StatisticsComponent }, */

      /* ................................................................................................. */
      /* MEMBERSHIP ROUTES */
      /* ................................................................................................. */
      {
        path: "memberships",
        loadChildren: `../pages/admin/membership/membership.module#MembershipModule`
      },

      /* ................................................................................................. */
      /* Skills routes */
      /* ................................................................................................. */
      {
        path: "skills",
        loadChildren: `../pages/admin/skills/skills.module#SkillsModule`
      },

      /* ................................................................................................. */
      /* BUSINESS PROFILE */
      /* ................................................................................................. */
      {
        path: "business",
        component: BusinessComponent,
        children: [
          {
            path: "list",
            component: BusinessListComponent
          },
          {
            path: "profile/:id",
            component: BusinessProfileComponent,
            resolve: {
              business: BusinessResolverService
            }
          },
          {
            path: "plans",
            component: BusinessPlansComponent
          },
          {
            path: "purchases",
            component: BusinessPurchasesComponent
          }
        ]
      },

      /*  { path: 'company', component: CompanyComponent },
      { path: 'company/:page', component: CompanyComponent },
      { path: 'company/:page/:numRecords', component: CompanyComponent, },
      { path: 'form-company', component: FormCompanyComponent },
      { path: 'form-company/:id', component: FormCompanyComponent },

      { path: 'cost', component: CostComponent },
      { path: 'cost/:page', component: CostComponent },
      {
        path: 'cost/:page/:numRecords',
        component: CostComponent,
        children: [
          { path: 'form-cost', component: FormCostComponent },
          { path: 'form-cost/:id', component: FormCostComponent }
        ]
      }, */

      /* { path: 'companies', component: CompaiesLogisComponent },
      { path: 'companies/:page', component: CompaiesLogisComponent },
      {
        path: 'companies/:page/:numRecords', component: CompaiesLogisComponent,
      },
      {
        path: 'form-companies', component: FormCompaniesLogisComponent,
        children: [
          { path: 'form-userss', component: FormUserLogisComponent },
          { path: 'form-users/:id', component: FormUserLogisComponent }
        ]
      },
      {
        path: 'form-companies/:id', component: FormCompaniesLogisComponent,
        children: [
          { path: 'form-userss', component: FormUserLogisComponent },
          { path: 'form-users/:id', component: FormUserLogisComponent }
        ]
      }, */
      {
        path: "preinterviews",
        component: PreinterviewsComponent,
        children: [
          {
            path: "",
            component: PreinterviewsListComponent,
            children: [
              {
                path: "form-preinterviews",
                component: PreinterviewsFormComponent
              },
              {
                path: "form-preinterviews/:id",
                component: PreinterviewsFormComponent
              }
            ]
          }
        ]
      },
      {
        path: "preinterviews-users",
        component: PreinterviewsUsersComponent,
        children: [
          {
            path: "",
            component: PreinterviewsUsersListComponent
          }
        ]
      },
      /*------------------------------------------------------------------------------------------------------------------------
        Component for configure social networks 
      --------------------------------------------------------------------------------------------------------------------------*/
      {
        path: "social-networks",
        component: SocialNetworksComponent
      },

      /* ................................................................................................. */
      /* FPO - ITEMS */
      /* ................................................................................................. */
      {
        path: "FPO",
        component: FPOComponent,
        children: [
          {
            path: "list",
            component: FPOListComponent
          },
          {
            path: "create",
            component: SaveFPOComponent
          },
          {
            path: "edit/:id",
            component: SaveFPOComponent,
            resolve: {
              factor: FactorResolverService
            }
          },
          {
            path: "items/list",
            component: FPOItemListComponent
          },
          {
            path: "items/create",
            component: SaveFPOItemComponent
          },
          {
            path: "items/edit/:id",
            component: SaveFPOItemComponent
          }
        ]
      },

      {
        path: "entryOrders",
        loadChildren: `../pages/admin/entry-orders/entry-orders.module#EntryOrdersModule`
      },
      /* ................................................................................................. */
      /* statistics */
      /* ................................................................................................. */
      {
        path: "statistics",
        loadChildren: `../pages/admin/statistics/statistics.module#StatisticsModule`
      },

      /* ................................................................................................. */
      /* GROUP BUSINESSES */
      /* ................................................................................................. */
      {
        path: "groupBusinesses",
        loadChildren: `../pages/admin/group-business/group-business.module#GroupBusinessModule`
      },
      /* ................................................................................................. */
      /* BLOG */
      /* ................................................................................................. */
      {
        path: "blogs",
        loadChildren: `../pages/blog/blog.module#BlogModule`
      },
      /* ................................................................................................. */
      /* SUCCESS CASES */
      /* ................................................................................................. */
      {
        path: "success-cases",
        loadChildren: `../pages/success-case/success-case.module#SuccessCaseModule`
      },
      /*------------------------------------------------------------------------------------------------------------------------
        Chat component
      --------------------------------------------------------------------------------------------------------------------------*/
      {
        path: "chat",
        component: ChatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
