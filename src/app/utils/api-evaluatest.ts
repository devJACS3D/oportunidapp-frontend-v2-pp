import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CatchMessage } from "./catch-message";
import { UserAccountService } from "@services/user-account.service";
import { ConfigApiEval } from "./config-api-eval";
import { catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import { url } from "inspector";

@Injectable()
export class ApiEvaluatest {
  constructor(
    private http: HttpClient,
    private catchMessage: CatchMessage,
    private user: UserAccountService
  ) {}

  public profile() {
    let usrlog = this.user.getUser();
    for (let key in usrlog) {
      if (
        key == "isAdminProfile" ||
        key == "isPsychologistProfile" ||
        key == "isBusinessProfile" ||
        key == "isAgentProfile"
      ) {
        if (usrlog[key] === true) {
          return key;
          break;
        }
      }
    }
  }

  public login() {
    let body: any = JSON.stringify({
      userEmail: "mquinones@grupologis.co",
      password: ConfigApiEval.credential()
    });
    let url = ConfigApiEval.addPath("auth/v1/login");

    this.http.post(url, body, this.setOption()).subscribe((response: any) => {
      ConfigApiEval.setToken(response.access_token);
      return true;
    }),
      catchError(err => {
        let messageError = this.catchMessage.getMessage(err);
        console.error("User message =>", messageError);
        throw messageError;
      });
  }

  public get(pathName: string) {
    let url = ConfigApiEval.addPath(pathName);
    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getAlt(pathName: string) {
    return this.http.get(pathName, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCand(pathName: string) {
    const url = `https://apitalento.evaluatest.com/api/v1/${pathName}`;
    return this.http.get(url).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getProcess(pathName: string) {
    return this.http.get(pathName, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getEvaluacion(pathName: string) {
    let url = ConfigApiEval.addPath(pathName);
    return this.http.get(pathName, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }
  public getUnidad(pathName: string, idStruc: number) {
    let url = ConfigApiEval.addPath(pathName + idStruc);
    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCatalogos(pathName: string) {
    let url = ConfigApiEval.addPath("catalog/" + pathName + "/language/es-MX");
    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCatalogos2(pathName: string) {
    let url = "catalog/" + pathName + "/language/es-MX";
    // return this.setOption2();
    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCatalogosInd(pathName: string) {
    let url = ConfigApiEval.addPath(`catalog/${pathName}es-MX`);
    // return this.setOption2();
    return this.http.get(url, this.setOption2()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCatalogo(pathName: string) {
    let url = `catalog/${pathName}`;
    // return this.setOption2();
    return this.http.get(url, this.setOption2()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getReporte(path) {
    path = `report/${path}/`;
    let url = ConfigApiEval.addPath(path);

    return this.http.get(path, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getReporteDescarga(path) {
    path = `report/download/${path}`;
    let url = ConfigApiEval.addPath(path);

    return this.http.get(path, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getCandidatos(path) {
    path = `candidates/${path}`;
    let url = ConfigApiEval.addPath(path);

    return this.http.get(path, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public getReporteDescargaAlt(path) {
    let url = ConfigApiEval.addPathAlt(path);

    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public post(path: string, body: any) {
    let url = ConfigApiEval.addPath(path);
    return this.http.post(path, body, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public postGraphQl(path: string, body: any) {
    let url = ConfigApiEval.addPath(path);
    return this.http.post(url, { query: body }, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public postAlt(path: string, body: any) {
    let url = ConfigApiEval.addPath(path);
    return this.http.post(url, body, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public postAddVacante(path: string, body: any) {
    let idPuestoAdd = ConfigApiEval.selectIdPuesto;
    let url = ConfigApiEval.addPath(`${path}${idPuestoAdd}/language/es-MX`);
    return this.http.post(url, body, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public postReporteDescargaAlt(path, body) {
    let url = ConfigApiEval.addPathAlt(path);

    return this.http.post(url, body, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public putFolder(path: string, body: any) {
    let url = ConfigApiEval.addPath(path);
    return this.http.put(path, body, this.setOption()).pipe(
      map((response: any) => response),
      catchError((error: any) => {
        console.log(error);
        return of(null);
      })
    );
  }

  public headReporte(path) {
    path = `report/download/${path}`;

    return this.http.get(path, this.setOption()).pipe(
      map((response: any) => true),
      catchError((error: any) => {
        return of(false);
      })
    );
  }

  public headReporteAlt(path) {
    let url = ConfigApiEval.addPathAlt(path);

    return this.http.get(url, this.setOption()).pipe(
      map((response: any) => true),
      catchError((error: any) => {
        return of(false);
      })
    );
  }

  private setOption() {
    const autorization: any = "Bearer " + ConfigApiEval.token_access;
    const subscriptions: any = ConfigApiEval.subscription;
    const options: any = {};

    let headers: HttpHeaders = new HttpHeaders({});
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("Ocp-Apim-Subscription-Key", subscriptions);
    headers = headers.append("Authorization", autorization);

    options.headers = headers;
    return options;
  }

  private setOption2() {
    const autorization: any = "Bearer " + ConfigApiEval.token_access;
    const subscriptions: any = ConfigApiEval.subscription;
    const options: any = {};

    let headers: HttpHeaders = new HttpHeaders({});
    headers = headers.append("Ocp-Apim-Subscription-Key", subscriptions);
    headers = headers.append("Authorization", autorization);
    headers = headers.append("Content-Type", "application/json");

    options.headers = headers;
    return options;
  }
}
