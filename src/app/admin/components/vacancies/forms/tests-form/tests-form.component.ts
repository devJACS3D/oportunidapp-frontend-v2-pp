import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ApiResponse } from "@apptypes/api-response";
import { ITest } from "@apptypes/entities/test";
import { Entities } from "@services/entities";
import { LocalStorageService } from "@services/local-storage.service";
import { Api } from "@utils/api";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Component({
  selector: "tests-form",
  templateUrl: "./tests-form.component.html",
  styleUrls: ["./tests-form.component.scss"]
})
export class TestsFormComponent implements OnInit {
  @Output("onClose") onClose: EventEmitter<boolean> = new EventEmitter();
  @Output("onError") onError: EventEmitter<any> = new EventEmitter();
  @Input("tests") tests: FormArray;
  @Input("infoReque") infoReque: any;
  @Input("isSubmitting") isSubmitting: boolean;
  @Output("handleSave") handleSave: EventEmitter<boolean> = new EventEmitter();
  $tests: Observable<ITest[]>;

  evalPruebaSel: any[];

  idPuesto: number = 0;

  constructor(
    private _api: Api,
    private _apiEval: ApiEvaluatest,
    private _storageService: LocalStorageService
  ) {}

  ngOnInit() {
    let idUnity = localStorage.getItem("idEmp");
    this.getTests();
    if (idUnity == "new") {
      this.addEmpresaCarp("empresa");
    } else {
      this.cargarEvaluacion(idUnity);
    }
  }

  close() {
    this.onClose.emit(false);
  }

  public getTests() {
    this.$tests = this._api.get(Entities.tests, null, 1, 1000).pipe(
      map((response: ApiResponse) => {
        return response.response.data;
      }),
      catchError(err => {
        this.onError.emit(err);
        console.log(err);
        throw err;
      })
    );
  }

  public addOrRemove($event, test: ITest) {
    const isChecked = $event.target.checked;
    if (isChecked) {
      //this.services.push(service);
      this.tests.push(new FormControl(test.id));
    } else if (this.findControlIndex(test.id) >= 0) {
      this.tests.removeAt(this.findControlIndex(test.id));
    }
  }

  compare(value) {
    const array = this.tests.value as Array<any>;
    if (array.find(val => val === value)) {
      return true;
    }
    return false;
  }

  public findControlIndex(predicate) {
    return this.tests.controls.findIndex(s => s.value === predicate);
  }

  public save() {
    this.handleSave.emit(true);
  }

  public async addEmpresaCarp(typeAdd) {
    // creamos el body de la solicitud
    let nameSub: string;
    let idIns: number;
    if (typeAdd == "subcarpeta") {
      nameSub = this.infoReque[3].toUpperCase().trim();
      idIns = parseInt(localStorage.getItem("unityId"));
    } else {
      nameSub = this.infoReque[1].trim();
      idIns = 0;
    }
    let locationEmp = `${this.infoReque[3].trim()} ${this.infoReque[2].trim()}`;
    let data = JSON.stringify({
      model: {
        EntityName: nameSub,
        EntityLocation: locationEmp,
        EntityStructureFatherId: idIns
      }
    });

    // guardamos la empresa
    let path = "unity/structure/v1/folder";
    const respIns: any = await this._apiEval.putFolder(path, data).toPromise();
    let idResp = respIns.EntityStructureId;

    if (typeAdd == "empresa") {
      // BUSCAR EL ID DE LA EMPRESA
      this.setVacancieAndEmpresas(idResp, "empresa");
      localStorage.setItem("unityId", idResp);
    } else {
      const idEmpPadre = localStorage.getItem("unityId");
      localStorage.setItem("unityId", idResp);
      this.setVacancieAndEmpresas(idEmpPadre, "subcarpeta", idResp);
    }
  }

  // buscar id empresa que se agrego
  public setVacancieAndEmpresas(idpadreEmp, type, idSub?: number) {
    this._apiEval.get("unity/v1/folders").subscribe(
      respNivel => {
        let infoEst = respNivel.St.EnterpriseStructureTree;

        for (let i = 0; i < infoEst.length; i++) {
          let estEmpresa = infoEst[i];
          if (estEmpresa.Id == idpadreEmp) {
            // GUARDARLO EN idEmp LOCALSTORAGE
            localStorage.setItem("idEmp", estEmpresa.I);
            if (type == "subcarpeta") {
              for (let j = 0; j < estEmpresa.S.length; j++) {
                const subcarpeta = estEmpresa.S[j];
                if (subcarpeta.Id == idSub) {
                  localStorage.setItem("idSub", subcarpeta.I);
                  localStorage.setItem("existeSub", "true");
                  this.cargarEvaluacion(subcarpeta.I);
                }
              }
            }
            // ANTES DE LLAMAR ESTA FUNCION Y PASARLE idEmp
            this.cargarEvaluacion(estEmpresa.I);
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  public async cargarEvaluacion(idUnity) {
    let addSubcarpeta = localStorage.getItem("existeSub");
    if (addSubcarpeta == "false") {
      await this.addEmpresaCarp("subcarpeta");
    }

    this._apiEval.get(`unity/jobs/v1/${idUnity}`).subscribe(
      respVacEmp => {
        this.buscarVacante(respVacEmp);
      },
      error => {
        console.log(error);
      }
    );
  }

  public buscarVacante(respVacEmp) {
    let idUnity = this._storageService.getFilterItem("idEmp");
    for (let i = 0; i < respVacEmp.Jobs.length; i++) {
      let jobs = respVacEmp.Jobs[i];
      if (jobs.Name == this.infoReque[0]) {
        idUnity = jobs.Id;
        this.idPuesto = jobs.Id;
        break;
      }
    }
    this.traerEvaluacionVacante(idUnity);
  }

  public traerEvaluacionVacante(idUnity) {
    const path = `evaluationorder/v1/jobprofile/${idUnity}`;
    this._apiEval.getEvaluacion(path).subscribe(
      respEval => {
        this.evalPruebaSel = respEval;
      },
      error => {
        console.log(error);
      }
    );
  }

  public updatePrueba(
    idOrdenEval: number,
    idPuesto: number,
    isChecked: boolean
  ) {
    if (idPuesto == 0) {
      const inputsChecked: any = document.querySelectorAll(
        '#evaluatestPruebas input[type="checkbox"]:checked'
      );

      // Crear un contador para generar un nombre único para cada elemento guardado en el localstorage
      const pruebasSeleccionadas = {};
      localStorage.removeItem("pruebasSeleccionadas");

      inputsChecked.forEach(input => {
        const labelChecked = document.getElementById(
          `lbl-prueba-check-${input.value}`
        );
        const value = labelChecked.innerText;
        pruebasSeleccionadas[input.value] = value;

        localStorage.setItem(
          "pruebasSeleccionadas",
          JSON.stringify(pruebasSeleccionadas)
        );
      });
    } else {
      for (let i = 0; i < this.evalPruebaSel.length; i++) {
        let evaluacion = this.evalPruebaSel[i];
        if (idOrdenEval == evaluacion.id) {
          let id = evaluacion.id;
          let jobProfileId = idPuesto;
          let jobProfEvalTypeId = evaluacion.jobProfileEvaluationTypeId;
          let order = evaluacion.order;
          let active = isChecked;

          let data = JSON.stringify([
            {
              id: id,
              jobProfileId: jobProfileId,
              jobProfileEvaluationTypeId: jobProfEvalTypeId,
              order: order,
              isActive: active
            }
          ]);

          this._apiEval.post("evaluationorder/v1/jobprofile", data).subscribe(
            respUpd => {
              console.log(respUpd);
              // this.evalPruebaSel = respEval;
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    }
  }
}
