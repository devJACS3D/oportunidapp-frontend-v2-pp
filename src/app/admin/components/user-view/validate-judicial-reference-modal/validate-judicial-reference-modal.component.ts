import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { MESSAGE } from "src/app/constants/constants";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import { applymentStatus } from "@apptypes/enums/applymentStatus.enum";
import { IBusinessAppUser } from "@apptypes/entities/BusinessAppUser";
import { ModalService } from "src/app/components/modal/modal.service";
import { ModalAddCommentsComponent } from "src/app/components/modals/modal-add-comments/modal-add-comments.component";
import { finalize } from "rxjs/operators";
@Component({
  selector: "validate-judicial-reference-modal",
  templateUrl: "./validate-judicial-reference-modal.component.html",
  styleUrls: ["./validate-judicial-reference-modal.component.scss"]
})
export class ValidateJudicialReferenceModalComponent implements OnInit {
  @Output() modalJudicial = new EventEmitter<any>();
  @Input() vacancyApplyment: IBusinessAppUser;
  public step: number = 1;
  public loading: boolean = false;
  vaStatus = applymentStatus;

  constructor(
    private alert: DialogService,
    private api: Api,
    private modalService: ModalService
  ) {}

  ngOnInit() {}
  /*------------------------------------------------------------------------------------------------------------------------
    Close the modal
  --------------------------------------------------------------------------------------------------------------------------*/
  close() {
    this.modalJudicial.emit({ modal: false, disabledButtonJudicial: false });
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Process background download
  --------------------------------------------------------------------------------------------------------------------------*/
  public async judicialLaunch() {
    const user = this.vacancyApplyment.user;
    const body = {
      doc: user.identification,
      typedoc: user.identificationType.name.replace(".", ""),
      fechaE: user.identificationIssueDate
    };
    this.loading = true;
    this.api
      .postData(
        `${Entities.judicialBackground}/report/judicialBackgroundDownload`,
        body
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (res: any) =>
          Utilities.downloadFromBase64(res.response, "antecedentes.pdf"),
        error => this.alert.errorAlert(error)
      );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Approve the judicial record of the agent
  --------------------------------------------------------------------------------------------------------------------------*/
  public async approve() {
    const { modal, modalRef } = await this.instanceModalAddComments();
    modalRef.instance.data.subscribe(async (res: any) =>
      this.approveWithComment(modal, modalRef, res)
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
     APPROVE ANTECEDENT WITH COMMENT
  --------------------------------------------------------------------------------------------------------------------------*/
  async approveWithComment(modal: any, modalRef: any, res: any) {
    try {
      this.setLoading(modal, modalRef, true);
      const user = this.vacancyApplyment.user;
      const jsonData = { comment: res.comment, userId: user.id };
      const body = {
        vacancyApplymentStatusId: this.vaStatus.REF_BACKGROUND_CHECK
      };
      const vacancyApplicationId = this.vacancyApplyment.vacancyApplyment.id;
      await this.api
        .postData(
          `${Entities.judicialBackground}/create/backgroundApproved`,
          jsonData
        )
        .toPromise();
      await this.api
        .put(Entities.vacancyApplications, body, vacancyApplicationId)
        .toPromise();
      modal.close();
      this.modalJudicial.emit({ modal: false, disabledButtonJudicial: true });
      this.alert.successAlert(`${MESSAGE.ANTECEDENT} aprobado con éxito`);
    } catch (error) {
      this.alert.errorAlert(error);
    } finally {
      this.setLoading(modal, modalRef, false);
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Reject an antecedent and send an email to the agent
  --------------------------------------------------------------------------------------------------------------------------*/
  public async reject() {
    const { modal, modalRef } = await this.instanceModalAddComments();
    modalRef.instance.data.subscribe(async (res: any) =>
      this.rejectWithComment(modal, modalRef, res)
    );
  }
  /*------------------------------------------------------------------------------------------------------------------------
    REJECTED PRE INTERVIEW WITH COMMENT
  --------------------------------------------------------------------------------------------------------------------------*/
  async rejectWithComment(modal: any, modalRef: any, res: any) {
    try {
      this.setLoading(modal, modalRef, true);
      const user = this.vacancyApplyment.user;
      const email = user.credentialUser.email;
      const name = user.firstName;
      const comment = res.comment;
      const body = { email, name, comment };
      const jsonData = { comment, userId: user.id };
      await this.api
        .postData(
          `${Entities.judicialBackground}/create/backgroundRejected`,
          jsonData
        )
        .toPromise();
      await this.api.postData(Entities.judicialReject, body).toPromise();
      modal.close();
      this.modalJudicial.emit({ modal: false, disabledButtonJudicial: true });
      this.alert.successAlert(`${MESSAGE.ANTECEDENT} rechazado con éxito`);
    } catch (error) {
      this.alert.errorAlert(error);
    } finally {
      this.setLoading(modal, modalRef, false);
    }
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Instance modal add comments
  --------------------------------------------------------------------------------------------------------------------------*/
  async instanceModalAddComments() {
    const modal = this.modalService.create(ModalAddCommentsComponent, {});
    const modalRef: any = await modal.getReference();
    return { modal, modalRef };
  }
  /*------------------------------------------------------------------------------------------------------------------------
    Loading data
  --------------------------------------------------------------------------------------------------------------------------*/
  setLoading(modal, modalRef, loading) {
    modalRef.instance.setLoading = loading;
    modal.setLoading(loading);
  }
}
