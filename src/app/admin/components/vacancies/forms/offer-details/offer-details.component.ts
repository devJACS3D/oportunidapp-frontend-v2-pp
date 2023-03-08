import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ApiResponse } from "@apptypes/api-response";
import { IContractType } from "@apptypes/entities/contract-type";
import { ILanguage } from "@apptypes/entities/language";
import { IWorkday } from "@apptypes/entities/workday";
import { Entities } from "@services/entities";
import { Api } from "@utils/api";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { RegexUtils } from "@utils/regex-utils";
import { Utilities } from "@utils/utilities";
import * as moment from "moment";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
  selector: "offer-details",
  templateUrl: "./offer-details.component.html",
  styleUrls: ["./offer-details.component.scss"]
})
export class OfferDetailsComponent implements OnInit {
  @Input("formGroup") formGroup: FormGroup;
  @Output("onError") onError: EventEmitter<any> = new EventEmitter();
  $workdays: Observable<IWorkday[]>;
  $contractTypes: Observable<IContractType[]>;
  $languages: Observable<ILanguage[]>;
  listNivelRiesgo: any[];
  listApertura: any[];
  contractTypeEvals: any[] = [
    { id: 1, idEval: 2 },
    { id: 2, idEval: 4 },
    { id: 3, idEval: 8 },
    { id: 4, idEval: 3 }
  ];

  public maskCurrency: RegExp = RegexUtils._maskCurrency;
  public maskNumber: RegExp = RegexUtils._maskNumber;
  public minDate: any;

  constructor(private _api: Api, private _apiEval: ApiEvaluatest) {}

  ngOnInit() {
    this.getWorkDays();
    this.getContractTypes();
    this.getLanguages();
    this.getNivelRiesgo();
    this.getApertura();
    this.minDate = Utilities.formatDate(moment().unix());
  }

  private getWorkDays() {
    this.$workdays = this._api.get(Entities.workdays, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        throw err;
      })
    );
  }

  private getContractTypes() {
    this.$contractTypes = this._api
      .get(Entities.contractTypes, null, 1, 1000)
      .pipe(
        map((response: ApiResponse) => {
          return response.response.data;
        }),
        catchError(err => {
          this.onError.emit(err);
          throw err;
        })
      );
  }

  private getLanguages() {
    this.$languages = this._api.get(Entities.languages, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        throw err;
      })
    );
  }

  public getLanguagesFormArray() {
    return this.formGroup.controls["languages"] as FormArray;
  }

  public addOrRemoveLanguage($event: any, language: ILanguage) {
    const formArray = this.getLanguagesFormArray();
    const checked = $event.target.checked;

    if (checked) {
      return formArray.push(new FormControl(language.name));
    } else if (this.findLanguageIndex(language.name) >= 0) {
      return formArray.removeAt(this.findLanguageIndex(language.name));
    }
  }

  compare(value) {
    if (this.findLanguageIndex(value) >= 0) {
      return true;
    }
    return false;
  }

  public findLanguageIndex(criteria) {
    const formArray = this.getLanguagesFormArray();

    return formArray.controls.findIndex(control => control.value === criteria);
  }

  get minMaxErrorMsg() {
    return {
      minMaxSalary: "El salario mínimo no debe ser mayor al salario máximo."
    };
  }

  getNivelRiesgo() {
    const path = "risklevel/v1/job";
    this._apiEval.getCatalogo(path).subscribe(
      respNv => {
        this.listNivelRiesgo = respNv;
      },
      error => {
        console.log(error);
      }
    );
  }

  getApertura() {
    const path = "openingreason/v1/language/es";
    this._apiEval.getCatalogo(path).subscribe(
      respNv => {
        this.listApertura = respNv;
      },
      error => {
        console.log(error);
      }
    );
  }

  addIdEval(id: number) {
    this.contractTypeEvals.forEach(type => {
      if (type.id == id) {
        this.formGroup.get("contractTypeIdEval").setValue(type.idEval);
      }
    });
  }
}
