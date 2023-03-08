import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiResponseRecords, ApiResponse } from "@apptypes/api-response";
import { IPagination } from "@apptypes/pagination";
import { Router, ActivatedRoute } from "@angular/router";
import { Api } from "@utils/api";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { Entities } from "@services/entities";
import { Utilities } from "@utils/utilities";
import { ITestApplyment } from "@apptypes/entities/test";
import { finalize, map } from "rxjs/operators";
import { COLORS } from "src/app/constants/constants";
import { AddCommentComponent } from "src/app/components/add-comment/add-comment.component";
import { ModalService } from "src/app/components/modal/modal.service";
import { ModalAddCommentsComponent } from "src/app/components/modals/modal-add-comments/modal-add-comments.component";

@Component({
  selector: "app-finished-tests",
  templateUrl: "./finished-tests.component.html",
  styleUrls: ["./finished-tests.component.scss"]
})
export class FinishedTestsComponent implements OnInit {
  public utils = Utilities;
  public tableHeaders = [
    "Nombre de la prueba",
    "Nombre de usuario",
    "Resultado de la prueba"
  ];
  private _tests: ITestApplyment[];
  //pagination
  filterParams: Object;
  private _pagination: IPagination;
  public currentPage: number = 1;
  public loadingPage: boolean;
  public itemsPerPage: number = 10;

  @ViewChild("addComentComponent", { read: false })
  addCommentComponent: AddCommentComponent;
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _api: Api,
    private _alert: DialogService,
    private modalService: ModalService
  ) {}

  async ngOnInit() {
    this._activatedRoute.data
      .pipe(map(res => res.tests))
      .subscribe((data: ApiResponseRecords<ITestApplyment>) => {
        this.tests = data.data ? data.data : [];
        this.pagination = data;
      });
  }
  set tests(tests: ITestApplyment[]) {
    this._tests = tests;
  }
  set pagination(pagination) {
    this._pagination = {
      pages: Utilities.recordPages(pagination.pagesNumber),
      pagesNumber: pagination.pagesNumber,
      elementsNumber: pagination.elementsNumber,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.currentPage
    };
  }
  get tests(): ITestApplyment[] {
    return this._tests;
  }
  get pagination(): any {
    return this._pagination;
  }

  private async fetchData(filters?: Object) {
    this.loadingPage = true;
    try {
      let data: ApiResponse = await this._api
        .get(
          Entities.testsFinished,
          null,
          this.currentPage,
          this.itemsPerPage,
          filters
        )
        .toPromise();
      this.tests = data.response.data;
      this.pagination = data.response;
      /*  this._error = null; */
    } catch (error) {
      console.log(error);
      /*  this._error = error; */
    } finally {
      this.loadingPage = false;
    }
  }

  public async goToPage(event: any) {
    if (event.direction)
      event.pageNumber =
        parseInt(event.pageNumber.toString()) +
        parseInt(event.direction.toString());

    this.currentPage = event.pageNumber;
    this.itemsPerPage = event.itemsPerPage;
    this.fetchData(this.filterParams);
  }
  public applyFilters(filter) {
    this.currentPage = 1;
    this.filterParams = filter;
    this.fetchData(this.filterParams);
  }
  public downloadReport(item: ITestApplyment) {
    const q = JSON.stringify({
      vacancyId: item.vacancyApplication.vacancyId,
      userId: item.userId
    });
    this._router.navigate([`print/psychotechnicalTest`], {
      queryParams: {
        q: q
      }
    });
  }

  showSetCompetentAlert(test: ITestApplyment) {
    this._alert.customAlert({
      icon: COLORS.WARNING,
      message: `¿Como deseas calificar al usuario?`,
      bgColor: COLORS.WARNING,
      bgTop: true,
      buttons: [
        {
          name: "No aprobado",
          class: "primary-border",
          onClick: async () => {
            this._alert.closeAlert();
            this.showDenyModal(test);
          }
        },
        {
          name: "Aprobado",
          class: "primary-default",
          onClick: async () => {
            this._alert.loadingAlert(this, true);
            await this.onApprove(test);
            this._alert.loadingAlert(this, false);
          }
        }
      ]
    });
  }

  async accept(modal, modalRef, test: ITestApplyment, comment: string) {
    try {
      modalRef.instance.setLoading = true;
      modal.setLoading(true);
      const body = {
        vacancyApplymentStatusId: 4,
        psychologistCommentInTest: comment
      };
      await this._api
        .put(Entities.vacancyApplications, body, test.vacancyApplicationId)
        .toPromise();
      this._alert.closeAlert();
      test.vacancyApplication.vacancyApplymentStatusId = 4;
      modal.close();
      this.nexStep(test);
    } catch (error) {
      this._alert.customAlert({
        icon: COLORS.WARNING,
        message: error,
        bgColor: COLORS.DANGER,
        bgTop: true,
        autoClose: true
      });
    }
  }

  nexStep(test: ITestApplyment) {
    this._alert.customAlert({
      icon: "success_white",
      message: `¡Usuario aprobado exitosamente!`,
      bgColor: COLORS.SUCCESS,
      bgTop: true,
      buttons: [
        {
          name: "Agendar entrevista",
          class: "primary-border",
          onClick: () => {
            this._alert.closeAlert();
            this._router.navigate(["../../../calendar"], {
              relativeTo: this._activatedRoute,
              queryParams: {
                schedule: JSON.stringify({
                  uid: test.userId,
                  vid: test.vacancyApplication.vacancyId
                })
              }
            });
          }
        },
        {
          name: "Continuar",
          class: "primary-default",
          onClick: async () => {
            this._alert.closeAlert();
          }
        }
      ]
    });
  }

  async deny(data: any) {
    this.addCommentComponent.isSubmitting = true;

    this._api
      .post(Entities.rejectedTestsToVacancyApplications, {
        referenceId: data.data, // data => id in this case,
        reason: data.comment
      })
      .pipe(finalize(() => (this.addCommentComponent.isSubmitting = false)))
      .subscribe(
        res => {
          this.fetchData({});
          this.addCommentComponent.close(true);
        },
        error => {
          this._alert.customAlert({
            icon: COLORS.WARNING,
            message: error,
            bgColor: COLORS.DANGER,
            bgTop: true,
            autoClose: true
          });
        }
      );
    /* try {
			const body = { vacancyApplymentStatusId: 3, psychologistCommentInTest: data.comment };
			await this._api.put(Entities.vacancyApplications, body, data.data).toPromise();
			this.addCommentComponent.close(true);
		} catch (error) {
			this._alert.customAlert({
				icon: COLORS.WARNING,
				message: error,
				bgColor: COLORS.DANGER,
				bgTop: true,
				autoClose: true
			});
		} finally {
			this.addCommentComponent.isSubmitting = false;
		} */
  }

  showDenyModal(test: ITestApplyment) {
    this.addCommentComponent.open();
    this.addCommentComponent.data = test.id;
  }

  /*----------------------------------------------------
  Approve a test associated with an agent 
  ----------------------------------------------------*/
  async onApprove(test: ITestApplyment) {
    const modal = this.modalService.create(ModalAddCommentsComponent, {});
    const modalRef: any = await modal.getReference();
    modalRef.instance.data.subscribe(async (res: any) =>
      this.accept(modal, modalRef, test, res.comment)
    );
  }
}
