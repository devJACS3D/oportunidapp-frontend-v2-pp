import { environment } from "../../environments/environment";

export class ConfigApiEval {
  public static url: string = environment.apiEvalHost;
  public static pathUrlAlt: string = environment.apiVersion;
  public static urlAlt: string = environment.apiEmpHost;

  public static get token_access(): string {
    return localStorage.getItem("Access");
  }

  public static get subscription(): string {
    return "2b47f1dd5b6349668c59c4a62c4263f6";
  }

  public static setToken(token: string) {
    localStorage.setItem("Access", token);
  }

  public static addPath(pathName: string) {
    return this.url + pathName;
  }

  public static addPathAlt(pathName: string) {
    return this.urlAlt + this.pathUrlAlt + pathName;
  }

  public static get selectIdPuesto(): string {
    return localStorage.getItem("unityId");
  }

  public static credential() {
    return "Gmm03*Am";
  }
}
