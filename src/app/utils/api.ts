import { Injectable } from '@angular/core';
import { map, catchError } from "rxjs/operators";
import { ConfigApi } from './config-api';
import { ApiResponse } from '@apptypes/api-response';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CatchMessage } from './catch-message';
import { LoggedUser } from '@apptypes/types';

@Injectable()
export class Api {

  private baseUrl: string = ConfigApi.baseUrl;

  constructor(
    private http: HttpClient,
    private catchMessage: CatchMessage
  ) { }

  public get(entidad: string, idEntidad?: any, pagina?: number, recordsNum?: number, params?: Object, reset?: boolean) {
    let apiUrl = ConfigApi.getEntidades(entidad, idEntidad, pagina, recordsNum, params);
    return this.http.get(apiUrl, this.setOptions()).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;
        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    )
  }

  public getReports(entidad: string, body: any) {
    let apiUrl = ConfigApi.postEntidad(entidad);
    let options = this.setOptions();
    let myParams: HttpParams = new HttpParams();
    myParams = myParams.append('startDate', body.startDate);
    myParams = myParams.append('endDate', body.endDate);
    options.params = myParams;

    options.body = myParams;

    return this.http.get(apiUrl, options).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;
        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    );
  }

  // public getReports(entidad: string, body: any) {
  //     let apiUrl = ConfigApi.postEntidad(entidad);
  //     return new Promise((resolve, reject) => {
  //         try {

  //             var data = `startDate=${body.startDate}&endDate=${body.endDate}`;
  //             const autorization: string = 'Bearer ' + ConfigApi.tokenAutentication;

  //             var xhr = new XMLHttpRequest();
  //             xhr.withCredentials = true;

  //             xhr.addEventListener("readystatechange", function () {
  //                 if (this.readyState === 4) {
  //                     // console.log(this.responseText);
  //                     resolve(this.responseText)
  //                 }
  //             });

  //             xhr.open("GET", apiUrl);
  //             xhr.setRequestHeader("Authorization", autorization);
  //             xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  //             xhr.setRequestHeader("cache-control", "no-cache");
  //             xhr.setRequestHeader("Postman-Token", "f437eef3-6b75-49cc-a4d1-8203fa1f7763");
  //             xhr.send(data);

  //         } catch (err) {
  //             reject(err);
  //         }
  //     });
  // }

  public getData(entidad: string, params?: Object) {
    let apiUrl = ConfigApi.getEntidades(entidad, null, null, null, params);
    const autorization: string = 'Bearer ' + ConfigApi.tokenAutentication;
    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Authorization', autorization);

    return this.http.get(apiUrl, { responseType: 'blob' as 'json', headers: headers }).pipe(
      map(res => {
        return res;
        //return res.blob();
      }),
      catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    );
  }

  public getDataGeneral() {

  }
  public post(entidad: string, body: any) {
    let apiUrl = ConfigApi.postEntidad(entidad);
    return this.http.post(apiUrl, body, this.setOptions()).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        console.log('User message =>',user_message);
        throw (user_message);
      })
    );
  }

  public postData(entidad: string, data: any) {
    let apiUrl = ConfigApi.postEntidad(entidad);
    const autorization: string = 'Bearer ' + ConfigApi.tokenAutentication;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', autorization);

    const body = new HttpParams()
      .set('archivo', data);

    return this.http.post(apiUrl, data, { headers: headers }).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    )
  }

  public put(entidad: string, body: any, idEntidad?: any) {
    let apiUrl = ConfigApi.putEntidad(entidad, idEntidad);

    return this.http.put(apiUrl, body, this.setOptions()).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    );
  }


  public patch(entidad: string, idEntidad: any) {

    let apiUrl = ConfigApi.patchEntidad(entidad, idEntidad);

    console.log('sss', this.setOptions(), apiUrl)

    return this.http.patch(apiUrl, this.setOptions()).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    );
  }

  public putData(entidad: string, data: any, idEntidad: any) {
    let apiUrl = ConfigApi.putEntidad(entidad, idEntidad);
    const autorization: string = 'Bearer ' + ConfigApi.tokenAutentication;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', autorization);

    const body = new HttpParams()
      .set('archivo', data);

    return this.http.put(apiUrl, data, { headers: headers }).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    )
  }

  public delete(entidad: string, idEntidad: number) {
    let apiUrl = ConfigApi.deleteEntidad(entidad, idEntidad);
    return this.http.delete(apiUrl, this.setOptions()).pipe(
      map((response: any) => {
        let resp: ApiResponse = response;

        return resp;
      }), catchError(err => {
        let user_message = this.catchMessage.getMessage(err);
        throw (user_message);
      })
    );
  }

  private setOptions() {
    const autorization: string = 'Bearer ' + ConfigApi.tokenAutentication;
    const options: any = {};

    let headers: HttpHeaders = new HttpHeaders({});
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', autorization);


    options.headers = headers;
    return options;
  }

  public getCurrentUser(): LoggedUser | undefined {
    const user = localStorage.getItem('current_user');

    const parseUser: LoggedUser = JSON.parse(user);
    if (!parseUser) return undefined;
    parseUser.isAdminProfile = (parseUser.userTypeId == 1) ? true : false;
    parseUser.isPsychologistProfile = (parseUser.userTypeId == 2) ? true : false;
    parseUser.isBusinessProfile = (parseUser.userTypeId == 3) ? true : false;
    parseUser.isAgentProfile = (parseUser.userTypeId == 4) ? true : false;
    parseUser['temporality'] = false;
    return parseUser
  }

  public signOut() {
    localStorage.clear();
    sessionStorage.clear();
  }
}
