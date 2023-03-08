import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ICity } from "@apptypes/entities/city";
import { IContractType } from "@apptypes/entities/contract-type";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { IState } from "@apptypes/entities/state";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { Observable, of, Subject } from "rxjs";
import { finalize, map, tap } from "rxjs/operators";
import { DialogService } from "src/app/components/dialog-alert/dialog.service";
import { COLORS } from "src/app/constants/constants";

@Component({
  selector: "app-save-entry-order",
  templateUrl: "./save-entry-order.component.html",
  styleUrls: ["./save-entry-order.component.scss"]
})
export class SaveEntryOrderComponent implements OnInit {
  public header = "Orden de ingreso";
  public data: IVacancyApplyment;
  public states$: Observable<IState>;
  public cities$: Observable<ICity>;
  public contractTypes$: Observable<IContractType[]>;
  public branchOffices$: Observable<any[]>;
  public payrollDays$: Observable<number[]>;
  public memberTypes$: Observable<string[]>;
  public submitting$: Subject<boolean> = new Subject();
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: Api,
    private alert: DialogService
  ) {}

  ngOnInit() {
    this.activatedRoute.data
      .pipe(
        map(actvRoute => actvRoute.data),
        tap(data => console.log(data))
      )
      .subscribe(data => (this.data = data));

    this.getStates();
    this.getBranchOffices();
    this.getContractTypes();
    this.getPayrollDays();
    this.getMemberTypes();
  }

  getStates() {
    this.states$ = this.api
      .get(Entities.states, null, 1, 1000)
      .pipe(map(res => res.response.data));
  }

  getBranchOffices() {
    this.branchOffices$ = this.api
      .get(`${Entities.groupBusinesses}/list`, null, 1, 1000, { gbActive: 1 })
      .pipe(map(res => res.response.data));
  }

  getContractTypes() {
    this.contractTypes$ = this.api
      .get(`${Entities.contractTypes}`, null, 1, 1000)
      .pipe(map(res => res.response.data));
  }

  getPayrollDays(){
    const days = new Array(31).fill(0).map((_valor, indice) => indice + 1);
    this.payrollDays$ = of(days);
  }

  getMemberTypes(){
    const types = ["Operativo","Manejo y confianza","Dirección manejo y confianza"]
    this.memberTypes$ = of(types);
  }

  getCities(stateId: number) {
    this.cities$ = this.api
      .get(Entities.cities, null, 1, 1000, { stateId })
      .pipe(map(res => res.response.data));
  }

  handleChange(event: object) {
    if (event["stateId"]) {
      this.getCities(event["stateId"]);
    }
  }

  goToList() {
    this.router.navigate(["../../list"], { relativeTo: this.activatedRoute });
  }

  handleSubmit(data) {
    this.submitting$.next(true);

    this.api
      .post(`${Entities.entryOrders}/create`, data)
      .pipe(finalize(() => this.submitting$.next(false)))
      .subscribe(
        res => {
          this.successAlert("Orden de ingreso guardada exitosamente");
          this.goToList();
        },
        error => {
          this.errorAlert(error);
        }
      );
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
    });
  }
}
