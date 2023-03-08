import {
  Component,
  Inject,
  InjectionToken,
  Injector,
  OnInit
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { ApiResponse } from "@apptypes/api-response";
import { ISuperUser } from "@apptypes/entities/ISuperUser";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { IVacancy } from "@apptypes/entities/vacancy";
import { ACTIONS } from "@apptypes/enums/actions.enum";
import { IModalReference, MODAL_DATA, MODAL_REFERENCE } from "@apptypes/IModal";
import { Entities } from "@services/entities";
import { ModalService } from "src/app/components/modal/modal.service";
import { Api } from "@utils/api";
import { Utilities } from "@utils/utilities";
import moment = require("moment");
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mapTo,
  shareReplay,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import { CommentComponent } from "src/app/components/comment/comment.component";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS } from "src/app/constants/constants";
import { merge, Observable, of, Subject } from "rxjs";

@Component({
  selector: "app-save-interview",
  templateUrl: "./save-interview.component.html",
  styleUrls: ["./save-interview.component.scss"]
})
export class SaveInterviewComponent implements OnInit {
  ACTIONS = ACTIONS;
  header: string;
  interviewForm: FormGroup;
  timeToShow: string;
  minDate: any;
  //pagination
  usersPage: number = 1;
  vacanciesPage: number = 1;
  interviewersPage: number = 1;
  //loading states
  loadingVacancies: boolean = false;
  loadingUsers: boolean = false;
  loadingInterviewers: boolean = false;
  isSubmitting: boolean = false;
  isSubmittingDoneStatus: boolean = false;

  vacancyFilters = {};

  vacancySearch$ = new Subject<string>();
  vacancyFilters$ = new Subject<Object>();
  vacancies$: Observable<IVacancy[]>;
  users$: Observable<IVacancyApplyment[]>;
  userSearch$ = new Subject<string>();
  interviewers$: Observable<any[]>;
  interviewerSearch$ = new Subject<string>();
  interviewerFilters$ = new Subject<Object>();

  constructor(
    @Inject(MODAL_DATA) public data: any,
    @Inject(MODAL_REFERENCE) public modalRef: IModalReference,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.minDate = Utilities.formatDate(moment().unix());
    this.data["date"] = this.setDate(this.data.date);
    this.data["time"] = this.setHour(this.data.time);
    this.setHeader();

    this.initForm(this.data);
    //this.fetchVacancies();

    this.fetchVacanciesWithFilter();
    this.fetchUsersWithFilter();
    this.fetchInterviewersWithFilters();
    this.initFilters(this.data);

    //patchform in case we are editing;
    if (this.data.type != ACTIONS.CREATE) {
      this.patchForm(this.data);
    }

    if (this.data.type === ACTIONS.DETAIL) {
      this.setDetailsForm();
    }
  }

  setHeader() {
    let title;
    switch (this.data.type) {
      case ACTIONS.CREATE:
        title = "Crear entrevista";
        break;
      case ACTIONS.DETAIL:
        title = "Entrevista pendiente";
        break;

      default:
        title = "Editar entrevista pendiente";
        break;
    }
    this.header = title;
  }

  notifyClient() {
    const interviewId = this.interviewForm.get("id").value;
    return this.api
      .put(Entities.sendNotification, null, interviewId)
      .subscribe(res => {
        this.successAlert(res.message);
      },(error)=> this.errorAlert(error));
  }

  schedule(){
    const interviewId = this.interviewForm.get("id").value;
    return this.api
      .put(Entities.addCalendar, null, interviewId)
      .subscribe(res => {
        this.successAlert(res.message);
      },(error)=> this.errorAlert(error));
    
  }

  /* ................................................................................................. */
  /* FORM */
  /* ................................................................................................. */
  initForm(data) {
    this.interviewForm = this.formBuilder.group({
      id: [null],
      date: [data["date"], [Validators.required]],
      hour: [data["time"], [Validators.required, this.validateHour.bind(this)]],
      userId: [null, [Validators.required]],
      vacancyId: [null, [Validators.required]],
      interviewerId: [null, [Validators.required]],
      address: [null, [Validators.required,Validators.minLength(4)]]
    });
  }

  private validateHour(formControl: FormControl) {
    const fromTime = this.data.time;
    const currenTime = formControl.value;
    let errors = {};
    if (currenTime.hour < fromTime.hour) {
      errors["timeError"] = {
        valid: false
      };
    }

    if (
      currenTime.hour >= fromTime.hour &&
      currenTime.minute < fromTime.minute
    ) {
      errors["timeError"] = {
        valid: false
      };
    }

    return Object.keys(errors).length > 0 ? { ...errors } : null;
  }

  get timeError() {
    const time = Utilities.timeToString(this.data.time);
    return `Por favor ingrese una hora mayor a ${time}`;
  }
  setDetailsForm() {
    this.interviewForm.get("vacancyId").disable();
    this.interviewForm.get("userId").disable();
    this.interviewForm.get("interviewerId").disable();
  }

  setEditableForm() {
    this.data.type = ACTIONS.EDIT;
    this.interviewForm.get("vacancyId").enable();
    this.interviewForm.get("userId").enable();
    this.interviewForm.get("interviewerId").enable();
  }
  patchForm(data: any) {
    setTimeout(() => {
      this.interviewForm.patchValue({
        id: data.id,
        date: data["date"],
        hour: data["time"],
        vacancyId: data.vacancyId,
        userId: data.userId,
        interviewerId: data.interviewerId,
        address: data.address
      });
    });
  }

  initFilters(data) {
    const filters = {};
    const interViewFilters = { search: "" };
    if (data["vacancyId"]) {
      filters["vacancyId"] = data["vacancyId"];
    }

    if (data["interviewerId"]) {
      interViewFilters["interviewerId"] = data["interviewerId"];
    }

    setTimeout(() => {
      this.vacancyFilters$.next(filters);
      this.interviewerFilters$.next(interViewFilters);
    });
  }

  get status() {
    if (this.data.done) return "Realizada";
    return "No realizada";
  }

  /* ................................................................................................. */
  /* FETCHDATA */
  /* ................................................................................................. */
  private fetchVacancies(filters) {
    console.log("filters => ", filters);
    return this.api
      .get(Entities.vacancies, null, this.vacanciesPage, 30, filters)
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingVacancies = false))
      );
  }
  private fetchUsers(filters: Object) {
    return this.api
      .get(Entities.candidatesSearch, null, this.usersPage, 30, filters)
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingUsers = false))
      );
  }

  private fetchInterviewers(filters: Object) {
    return this.api
      .get(
        Entities.interviewersSearch,
        null,
        this.interviewersPage,
        30,
        filters
      )
      .pipe(
        map(res => res.response.data),
        catchError(error => of([])),
        tap(() => (this.loadingInterviewers = false))
      );
  }
  private fetchInterviewersWithFilters() {
    const filterToSearch$ = this.interviewerSearch$.pipe(
      distinctUntilChanged(),
      debounceTime(600),
      map(s => ({ search: s ? s : "" }))
    );
    this.interviewers$ = merge(this.interviewerFilters$, filterToSearch$).pipe(
      tap(() => (this.loadingInterviewers = true)),
      switchMap(filters => this.fetchInterviewers(filters)),
      shareReplay(1)
    );
  }

  private fetchVacanciesWithFilter() {
    const filterToSearch$ = this.vacancySearch$.pipe(
      distinctUntilChanged(),
      debounceTime(600),
      map(s => ({ searchQuery: s ? s : "" }))
    );

    this.vacancies$ = merge(this.vacancyFilters$, filterToSearch$).pipe(
      tap(() => (this.loadingVacancies = true)),
      switchMap(filters => this.fetchVacancies(filters)),
      shareReplay(1)
    );
  }

  private fetchUsersWithFilter() {
    const control = this.interviewForm.get("vacancyId");
    const userControl = this.interviewForm.get("userId");
    const formVacandyId$ = control.valueChanges.pipe(
      tap(val => {
        val && this.data.type !== ACTIONS.DETAIL
          ? userControl.enable()
          : userControl.disable();
      }),
      filter(val => val !== null),
      map(vacancyId => {
        return {
          vacancyId,
          search: ""
        };
      })
    );

    const filterToSearch$ = this.userSearch$.pipe(
      distinctUntilChanged(),
      debounceTime(600),
      map(s => ({ search: s ? s : "", vacancyId: control.value }))
    );
    this.users$ = merge(formVacandyId$, filterToSearch$).pipe(
      tap(() => (this.loadingUsers = true)),
      switchMap(res => this.fetchUsers(res))
    );
  }
  /* ................................................................................................. */
  /* SUBMIT/SAVE/DELETE/EDIT */
  /* ................................................................................................. */
  async saveInterview() {
    this.isSubmitting = true;
    let response;
    try {
      if (
        this.data.type === ACTIONS.CREATE ||
        this.data.type === ACTIONS.SCHEDULE
      )
        response = (await this.api
          .post(Entities.interviews, this.payloadData)
          .toPromise()) as ApiResponse;
      else
        response = (await this.api
          .put(Entities.interviews, this.payloadData, this.payloadData.id)
          .toPromise()) as ApiResponse;
      this.successAlert(response.message);
      this.modalRef.modalRef.close(response.response);
    } catch (exception) {
      this.alert.errorAlert(exception);
    } finally {
      this.isSubmitting = false;
    }
  }

  async confirmDelete() {
    this.alert.customAlert({
      message: "¿Deseas eliminar el registro de la entrevista seleccionada?",
      bgColor: COLORS.DANGER,
      icon: "delete",
      bgBottom: true,
      closeButton: true,
      buttons: [
        {
          name: "Eliminar",
          onClick: async () => {
            this.deleteInterview();
            this.alert.closeAlert();
          }
        }
      ]
    });
  }

  async deleteInterview() {
    this.isSubmitting = true;
    const payload = this.payloadData;
    try {
      const response = (await this.api
        .delete(Entities.interviews, payload.id)
        .toPromise()) as ApiResponse;
      this.modalRef.modalRef.close({ type: ACTIONS.REMOVE, payload });
      this.successAlert(response.message);
    } catch (error) {
      console.log(error);
      this.alert.errorAlert(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  questionModal() {
    this.alert.customAlert({
      message: "¿Que acción deseas tomar?",
      bgColor: COLORS.WARNING,
      bgTop: true,
      icon: COLORS.WARNING,
      closeButton: true,
      buttons: [
        {
          name: "No Aprobado",
          class: "primary-border",
          onClick: () => {
            this.addFinalComment(false);
            this.alert.closeAlert();
          }
        },
        {
          name: "Aprobado",
          class: "primary-default",
          onClick: () => {
            this.addFinalComment(true);
            this.alert.closeAlert();
          }
        }
      ]
    });
  }

  addFinalComment(approved: boolean) {
    const commentModal = this.modalService.create(CommentComponent, {});
    commentModal.afterDestroy$.subscribe(res => {
      if (approved) this.markAsDone(approved, res.comment);
      else this.rejectInterview(res.comment);
    });
  }

  async markAsDone(approved: boolean, comment: string) {
    this.isSubmittingDoneStatus = true;
    const payload = this.payloadData;
    const body = {
      approved,
      done: true,
      comment,
      userId: payload.userId,
      vacancyId: payload.vacancyId
    };
    try {
      const response = await this.api
        .put(Entities.interviews, body, payload.id)
        .toPromise();
      this.data.done = true;
      payload.done = true;
      this.modalRef.modalRef.close({ type: ACTIONS.EDIT, payload });
      this.successAlert(response.message);
    } catch (error) {
      this.alert.errorAlert(error);
    } finally {
      this.isSubmittingDoneStatus = false;
    }
  }

  rejectInterview(reason: string) {
    const payload = this.payloadData; // interview data
    const body = {
      reason,
      referenceId: payload.id // interviewId
    };
    this.isSubmittingDoneStatus = true;

    this.api
      .post(Entities.rejectedInterviews, body)
      .pipe(finalize(() => (this.isSubmittingDoneStatus = false)))
      .subscribe(
        res => {
          this.data.done = true;
          payload.done = true;
          this.modalRef.modalRef.close({ type: ACTIONS.EDIT, payload });
        },
        error => this.alert.errorAlert(error)
      );
  }

  private get payloadData() {
    const date = Utilities.unixToDate(
      Utilities.unformatDate(this.interviewForm.value.date)
    );
    const hour = Utilities.pickerToBackTime(this.interviewForm.value.hour);
    const payload = {
      ...this.interviewForm.value,
      date,
      hour
    };

    if (this.data.type === ACTIONS.CREATE) delete payload.id;

    return payload;
  }
  /* ................................................................................................. */
  /* DATE FORMATS */
  /* ................................................................................................. */
  private setDate(date: string) {
    return date
      ? Utilities.formatDate(moment(date).unix())
      : Utilities.formatDate(moment().unix());
  }
  private setHour(hour: string) {
    const time = Utilities.hourFromString(hour);
    return time;
  }

  /* ................................................................................................. */
  /* CUSTOM PIPES */
  /* ................................................................................................. */
  get time() {
    const hour = this.interviewForm.get("hour").value;
    return Utilities.timeToString(hour);
  }

  /* ................................................................................................. */
  /* ALERTS */
  /* ................................................................................................. */
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
    })
  }
}
