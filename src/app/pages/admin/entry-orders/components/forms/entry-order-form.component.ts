import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ICity } from "@apptypes/entities/city";
import { IContractType } from "@apptypes/entities/contract-type";
import { IVacancyApplyment } from "@apptypes/entities/IVacancyApplyment";
import { IState } from "@apptypes/entities/state";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import moment = require("moment");
import { Observable, Subject, Subscription } from "rxjs";

@Component({
  selector: "app-entry-order-form",
  templateUrl: "./entry-order-form.component.html",
  styleUrls: ["./entry-order-form.component.scss"]
})
export class EntryOrderFormComponent implements OnInit {
  @Input() data: IVacancyApplyment;

  @Input("loadOpts") dataOpts: {
    states$: Observable<IState>;
    cities$: Observable<ICity>;
    branchOffices$: Observable<any[]>;
    contractTypes$: Observable<IContractType[]>;
    payrollDays$: Observable<number[]>;
    memberTypes$: Observable<string[]>;
    submitting$: Subject<boolean>;
  };

  public minDate = Utilities.formatDate(moment().unix());
  public maskCurrency: RegExp = RegexUtils._maskCurrency;
  entryOrderForm: FormGroup;

  loadingState: boolean = false;

  @Output("onChange") onChange: EventEmitter<object> = new EventEmitter();
  @Output("onSubmit") onSubmit: EventEmitter<object> = new EventEmitter();

  contractTypeSubscription: Subscription;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm(this.data);
  }

  initForm(data: IVacancyApplyment) {
    this.entryOrderForm = this.formBuilder.group({
      vacancyApplymentId: [data.id, Validators.required],
      groupBusinessId: [null, Validators.required],
      cityId: [null, Validators.required],
      contractTypeId: [null, Validators.required],
      salary: [
        data.vacancy.minSalary,
        [Validators.required, Validators.pattern(RegexUtils._rxCurrency)]
      ],
      costCenter: [""],
      bonuses: [""],
      others: [""],
      hireDate: [null, Validators.required],
      terminationDate: [null],
      payrollOn: [31, Validators.required],
      memberType: ["Operativo"]
    });

    this.contractTypeSubscription = this.entryOrderForm
      .get("contractTypeId")
      .valueChanges.subscribe(val => {
        if (val == 4) {
          this.addValidatioForWorkAndTask();
        } else {
          this.removeValidatioForWorkAndTask();
        }
      });
  }

  addValidatioForWorkAndTask() {
    this.entryOrderForm.addControl("work",this.formBuilder.control(null,Validators.required));
    this.entryOrderForm.addControl("task",this.formBuilder.control(null,Validators.required));
  }
  removeValidatioForWorkAndTask() {
    this.entryOrderForm.removeControl("work");
    this.entryOrderForm.removeControl("task");
  }

  stateChange(value) {
    this.onChange.emit({
      stateId: value
    });
  }

  submit() {
    let data = Object.assign({}, this.entryOrderForm.value);

    data["hireDate"] = Utilities.unixToDate(
      Utilities.unformatDate(data["hireDate"])
    ).toString();

    if (data["terminationDate"]){
      data["terminationDate"] = Utilities.unixToDate(
        Utilities.unformatDate(data["terminationDate"])
      ).toString();
    }else{
      delete data["terminationDate"];
    }
     

    data["salary"] = RegexUtils._unMaskCurrency(data["salary"]);
    this.onSubmit.emit({ ...data });
  }
}
