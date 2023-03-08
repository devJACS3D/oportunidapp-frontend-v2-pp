import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ApiEvaluatest } from "@utils/api-evaluatest";
import { Observable } from "rxjs";

@Component({
  selector: "app-inf-comparativo",
  templateUrl: "./inf-comparativo.component.html",
  styleUrls: ["./inf-comparativo.component.scss"]
})
export class InfComparativoComponent implements OnInit {
  @Output("onClose") onClose: EventEmitter<boolean> = new EventEmitter();
  @Input("candidatos") candidatos: any[];
  @Input("idVac") idVac: string;

  public espera: boolean = false;
  constructor(private _apiEval: ApiEvaluatest) {}

  ngOnInit() {}

  close() {
    this.onClose.emit(false);
  }

  downloadRepComparativo() {
    this.espera = true;
    const chec = document.querySelectorAll(
      '#listCandidatos input[type="checkbox"]:checked'
    );

    let body: any[] = [];

    chec.forEach((input: any) => {
      body.push(input.value);
    });
    body.push(`${629685}`);
    const url = `report/candidates/action/compare/vacant/${this.idVac}`;

    // const body: any[] = [601207, 581533, 575024, 545505, 541790];
    // const url = `report/candidates/action/compare/vacant/63257`;

    this._apiEval.postReporteDescargaAlt(url, body).subscribe(
      respComp => {
        // se recibe en base64 y se decodifica
        const byteCharacters = atob(respComp);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/pdf"
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "reporte-comparativo.pdf";
        link.click();
        this.espera = false;
        this.close();
      },
      error => {
        console.log(error);
        this.espera = false;
        this.close();
      }
    );
  }
}
