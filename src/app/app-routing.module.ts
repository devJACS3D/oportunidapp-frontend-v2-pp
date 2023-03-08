import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './landing/login/login.component';
import { AuthGuard } from './auth-guard.service';
import { PasswordRecoveryComponent } from './landing/password-recovery/password-recovery.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { VacantesComponent } from './home/vacantes/vacantes.component';
import { InicioComponent } from './home/inicio/inicio.component';
import { LoginUserComponent } from './home/login-user/login-user.component';
import { DetailVacanciesComponent } from './components/detail-vacancies/detail-vacancies.component';
import { BlogsComponent } from './home/blogs/blogs.component';
import { LockSessionComponent } from './lock-session/lock-session.component';
import { RegisterUserComponent } from './home/register-user/register-user.component';
import { ProfileUserComponent } from './home/profile-user/profile-user.component';
import { PersonalInformationComponent } from './home/profile-user/personal-information/personal-information.component';
import { StudiesComponent } from './home/profile-user/studies/studies.component';
import { FormStudiesComponent } from './home/profile-user/studies/form-studies/form-studies.component';
import { ExperiencesComponent } from './home/profile-user/experiences/experiences.component';
import { FormExperiencesComponent } from './home/profile-user/experiences/form-experiences/form-experiences.component';
import { UserTestsComponent } from './home/profile-user/user-tests/user-tests.component';
import { FormUserTestsComponent } from './home/profile-user/user-tests/form-user-tests/form-user-tests.component';
import { UserVacanciesComponent } from './home/profile-user/user-vacancies/user-vacancies.component';
import { DetailBlogsComponent } from './components/detail-blogs/detail-blogs.component';
import { RegisterCompanyComponent } from './business/register-company/register-company.component';
import { AlliancesPageComponent } from './home/alliances-page/alliances-page.component';
import { DetailAllianceComponent } from './components/detail-alliance/detail-alliance.component';
import { SuccessStoriesPageComponent } from './pages/success-case/success-stories-page/success-stories-page.component';
import { PriceComponent } from './home/price/price.component';
import { FiguresComponent } from './admin/components/figures/figures.component';
import { BenefitsComponent } from './home/benefits/benefits.component';
import { PostulantComponent } from './home/postulant/postulant.component';
import { DetailSuccessStoryComponent } from './pages/success-case/detail-success-story/detail-success-story.component';
import { UserWiewPostulantComponent } from './components/user-wiew-postulant/user-wiew-postulant.component';
import { FormReferencesComponent } from './home/profile-user/personal-information/form-references/form-references.component';
import { UserTestsResolverService } from '@services/resolvers/userTests.service';
import { InterviewsComponent } from './home/profile-user/interviews/interviews.component';
import { UsersInterviewsComponent } from './home/profile-user/interviews/users-interviews/users-interviews.component';
import { UsersPreinterviewsComponent } from './home/profile-user/interviews/users-preinterviews/users-preinterviews.component';
import { PartnersPageComponent } from './home/partners/partners-page/partners-page.component';
import { PartnersPageListComponent } from './home/partners/partners-page-list/partners-page-list.component';
import { BusinessPageComponent } from './home/business/business-page/business-page.component';
import { PartnersResolverService } from '@services/resolvers/partners.service';
import { ClientsPageComponent } from './home/clients/clients-page/clients-page.component';
import { ClientsPageListComponent } from './home/clients/clients-page-list/clients-page-list.component';
import { BusinessResolverService } from '@services/resolvers/business.service';
import { PersonalityTestComponent } from './home/profile-user/personality-test/personality-test.component';
import { PrintLayoutComponent } from './printables/print-layout/print-layout.component';
import { PrintPersonalityTestComponent } from './printables/print-personality-test/print-personality-test.component';
import { PersonalityTestScoreResolverService } from '@services/resolvers/personalityTestScore.service';
import { PsychotechnicalTestResolverService } from '@services/resolvers/psychotechnicalTest.service';
import { PrintPsychotechnicalTestComponent } from './printables/print-psychotechnical-test/print-psychotechnical-test.component';
import { ChatComponent } from './components/chat/chat.component';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { PrintInterviewComponent } from './printables/print-interview/print-interview.component';
import { PrintInterviewResolverService } from '@services/resolvers/printInterview.service';
import { PrintWorkReferencesComponent } from './printables/print-work-references/print-work-references.component';
import { PrintWorkReferenceResolverService } from '@services/resolvers/printWorkReference.service';
import { PrintPreInterviewComponent } from './printables/print-pre-interview/print-pre-interview.component';
import { PrintPreInterviewsResolverService } from '@services/resolvers/printPreinterviews.service';
import { PrintJudicialBackgroundComponent } from './printables/print-judicial-background/print-judicial-background.component';
import { PrintJudicialBackgroundResolverService } from '@services/resolvers/printJudicialBackground.service';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		children: [
			{ path: '', component: InicioComponent },
			{ path: 'chat', component: ChatComponent, canActivate: [IsAuthenticatedGuard] },
			{
				path: 'profile',
				component: ProfileUserComponent,
				canActivate: [AuthGuard],
				children: [
					{
						path: '', component: PersonalInformationComponent,
						children: [
							{ path: 'form-references', component: FormReferencesComponent },
							{ path: 'form-references/:id', component: FormReferencesComponent },
						]
					},
					{
						path: 'studies', component: StudiesComponent,
						children: [
							{ path: 'form-studies', component: FormStudiesComponent }
						]
					},
					{
						path: 'experiences', component: ExperiencesComponent,
						children: [
							{ path: 'form-experiences', component: FormExperiencesComponent }
						]
					},
					{
						path: 'user-tests',
						component: UserTestsComponent,
						children: [
							{
								path: 'form-user-tests/:id/:vacancyId',
								component: FormUserTestsComponent,
								resolve: {
									test: UserTestsResolverService,
								}
							},
						]

					},
					{
						path: 'personalityTest',
						component: PersonalityTestComponent,
					},
					{ path: 'user-vacancies', component: UserVacanciesComponent },
					{ path: 'user-vacancies/:page', component: UserVacanciesComponent },
					{ path: 'user-vacancies/:page/:numRecords', component: UserVacanciesComponent },

					{
						path: 'user-interview',
						component: InterviewsComponent,
						children: [
							{ path: 'interviews', component: UsersInterviewsComponent },
							{ path: 'preinterviews', component: UsersPreinterviewsComponent },
						]
					}
					// { path: 'user-interview', component: UserInterviewesComponent },
					// { path: 'user-interview/:page', component: UserInterviewesComponent },
					// { path: 'user-interview/:page/:numRecords', component: UserInterviewesComponent },
				]
			},

			{
				path:"blogs",
				loadChildren: `./pages/blog/blog.module#BlogModule`
			},
			{
				path:"success-cases",
				loadChildren: `./pages/success-case/success-case.module#SuccessCaseModule`
			},

			{ path: 'vacantes', component: VacantesComponent },
			{ path: 'vacantes/:page', component: VacantesComponent },
			{ path: 'vacantes/:page/:numRecords', component: VacantesComponent },
			{ path: 'vacantes/:page/:numRecords/detail-vacancy/:id', component: DetailVacanciesComponent },

			{ path: 'detail-vacancy/:id', component: DetailVacanciesComponent },

			{ path: 'login', component: LoginUserComponent, outlet: 'modal' },
			{ path: 'register', component: RegisterUserComponent, outlet: 'modal' },

			{ path: 'password-recovery', component: PasswordRecoveryComponent, outlet: 'modal' },
			{ path: 'reset-password/:key', component: ResetPasswordComponent, outlet: 'modal' },

			/* ................................................................................................. */
			/* PARTNERS */
			/* ................................................................................................. */
			{
				path: 'partners',
				component: PartnersPageComponent,
				children: [
					{
						path: '',
						component: PartnersPageListComponent
					},
					{
						path: ':id',
						component: BusinessPageComponent,
						resolve: {
							business: PartnersResolverService
						}
					}
				]
			},

			/* ................................................................................................. */
			/* CLIENTS */
			/* ................................................................................................. */
			{
				path: 'clients',
				component: ClientsPageComponent,
				children: [
					{
						path: '',
						component: ClientsPageListComponent
					},
					{
						path: ':id',
						component: BusinessPageComponent,
						resolve: {
							business: BusinessResolverService
						}
					}
				]
			},
			{ path: 'pricing', component: PriceComponent },
		],
	},
	{
		path: 'business',
		component: HomeComponent,
		children: [
			{ path: '', component: InicioComponent },
			{
				path: 'profile',
				component: ProfileUserComponent,
				canActivate: [AuthGuard],
				// canActivateChild: [AuthGuard],
				children: [
					{ path: '', component: PersonalInformationComponent },
					{
						path: 'studies', component: StudiesComponent,
						children: [
							{ path: 'form-studies', component: FormStudiesComponent }
						]
					},
					{
						path: 'experiences', component: ExperiencesComponent,
						children: [
							{ path: 'form-experiences', component: FormExperiencesComponent }
						]
					},
					{
						path: 'user-tests',
						component: UserTestsComponent,
						children: [
							{ path: 'form-user-tests/:id/:vacancyId', component: FormUserTestsComponent },
						]

					},

					{ path: 'user-vacancies', component: UserVacanciesComponent },
					{ path: 'user-vacancies/:page', component: UserVacanciesComponent },
					{ path: 'user-vacancies/:page/:numRecords', component: UserVacanciesComponent },
				]
			},
		
			{ path: 'figures', component: FiguresComponent },
			{ path: 'postulant', component: PostulantComponent },
			{ path: 'benefits', component: BenefitsComponent },
			
			{ path: 'login', component: LoginUserComponent, outlet: 'modal' },
			{ path: 'register', component: RegisterCompanyComponent, outlet: 'modal' },

			{ path: 'password-recovery', component: PasswordRecoveryComponent, outlet: 'modal' },
			{ path: 'reset-password/:key', component: ResetPasswordComponent, outlet: 'modal' },

		],

	},
	{
		path: 'login',
		component: LoginComponent,
		children: [
			{ path: 'password-recovery', component: PasswordRecoveryComponent, },
			{ path: 'reset-password/:key', component: ResetPasswordComponent, }
		]
	},
	{
		path: 'lock',
		component: LockSessionComponent,
		outlet: 'session'
	},
	{
		path: 'admin',
		loadChildren: `./admin/admin.module#AdminModule`,
		canLoad: [IsAuthenticatedGuard]
	},
	/* ................................................................................................. */
	/* PRINTABLES ROUTES */
	/* ................................................................................................. */
	{
		path: 'print',
		component: PrintLayoutComponent,
		children: [
			{ 
				path: 'personalityTest/:id', 
				component: PrintPersonalityTestComponent,
				resolve:{
					testData: PersonalityTestScoreResolverService
				} 
			},
			{ 
				path: 'psychotechnicalTest', 
				component: PrintPsychotechnicalTestComponent,
				resolve:{
					testData: PsychotechnicalTestResolverService
				} 
			},
			{ 
				path: 'interview', 
				component: PrintInterviewComponent,
				resolve:{
					testData: PrintInterviewResolverService
				} 
			},
			{ 
				path: 'workReferences', 
				component: PrintWorkReferencesComponent,
				resolve:{
					testData: PrintWorkReferenceResolverService
				} 
			},
			{ 
				path: 'preInterviews', 
				component: PrintPreInterviewComponent,
				resolve:{
					testData: PrintPreInterviewsResolverService
				} 
			},
			{ 
				path: 'judicialBackground', 
				component: PrintJudicialBackgroundComponent,
				resolve:{
					testData: PrintJudicialBackgroundResolverService
				} 
			}
		]
	},
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes,{
		useHash:true})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
