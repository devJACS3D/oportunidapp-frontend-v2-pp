import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ApiEvaluatest } from "@utils/api-evaluatest";

@Component({
  selector: "app-vacante-exis-empresa",
  templateUrl: "./vacante-exis-empresa.component.html",
  styleUrls: ["./vacante-exis-empresa.component.scss"]
})
export class VacanteExisEmpresaComponent implements OnInit {
  @Output("onClose") onClose: EventEmitter<boolean> = new EventEmitter();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input("dataEmpresa") dataEmpresa: any;
  @Input("vacante") vacante: string;

  public listaEmpresas: any[];
  public nomVacante: string;

  constructor(private _apiEval: ApiEvaluatest) {}

  ngOnInit() {
    this.insertModal();
  }

  close() {
    this.onClose.emit(true);
  }

  public insertModal() {
    this.nomVacante = this.dataEmpresa[0].nombreVacante;
    this.listaEmpresas = this.dataEmpresa;
  }

  public selectVacante(idEmpPad, idEmp, subcarpeta, idVacante) {
    // const path = `https://empresas.evaluatest.com/api/jobprofile/${idVacante}`;
    // const inf: any = this._apiEval.getAlt(path).toPromise();
    // const puestoTipo = inf.JobProfile.JobTypeId;
    // console.log(inf);

    localStorage.setItem("unityId", idEmpPad);
    localStorage.setItem("idEmp", idEmp);
    localStorage.setItem("idVacEx", idVacante);
    localStorage.setItem("existVac", "true");
    if (subcarpeta != undefined) {
      this.onChange.emit(subcarpeta);
      localStorage.setItem("subcarpeta", subcarpeta.posicion);
      // localStorage.setItem("subcarpeta", subcarpeta.nomPuesto);
    } else {
      this.onChange.emit("");
    }
    this.close();
  }
}
