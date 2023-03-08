import { environment } from "../../environments/environment";
import { ApiResponse } from "@apptypes/api-response";


export class ConfigApi {

  public static baseUrl: string = environment.apiHost + environment.apiVersion;

  public static get tokenAutentication(): string {
    return localStorage.getItem('Authorization');
  }


  public static getEntidades(entidad: string, id_entidad?: number, pagina?: number, recordsNum?: number, params?: Object) {
    if (id_entidad) {
      return this.baseUrl + entidad + '/' + id_entidad;
    } else {
      let additionalParams: string = '';
      if (params) {
        for (let i in params) {
          let param = `&${i}=${params[i]}`;
          additionalParams += param;
        }
      }

      let numberParam =  '&elementsNumber=' + recordsNum;
      return this.baseUrl + entidad + '?pageNumber=' + (pagina || 1) + numberParam + additionalParams;
    }
  }

  public static postEntidad(entidad: string) {
    return this.baseUrl + entidad;
  }

  public static putEntidad(entidad: string, id_entidad?: any) {

    if (id_entidad)
      return this.baseUrl + entidad + '/' + id_entidad;

    return this.baseUrl + entidad;
  }

  public static deleteEntidad(entidad: string, id_entidad: number) {
    return this.baseUrl + entidad + '/' + id_entidad;
  }

  public static patchEntidad(entidad: string, id_entidad: number) {
    return this.baseUrl + entidad + '/' + id_entidad;
  }



  public static setToken(token: string) {
    localStorage.setItem('Authorization', token);
  }

  public static setUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
    // console.log(user)
  }
}
