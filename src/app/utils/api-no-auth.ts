import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { ConfigApi } from "./config-api";
import { CatchMessage } from "./catch-message";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ApiNoAuth {
  constructor(private http: HttpClient, private catchMessage: CatchMessage) {}

  public get(entidad: string, idEntidad?: any) {
    return this.http
      .get(ConfigApi.getEntidades(entidad, idEntidad), this.setOptions())
      .pipe(
        map((response: any) => {
          let resp = response;

          return resp;
        }),
        catchError(err => {
          let user_message = this.catchMessage.getMessage(err);
          throw user_message;
        })
      );
  }

  public post(entidad: string, body: any) {
    return this.http
      .post(ConfigApi.postEntidad(entidad), body, this.setOptions())
      .pipe(
        map((response: any) => {
          let resp = response;

          if (entidad == "credentials/signin" || "user" || "companies") {
            if (resp.response && resp.response.token && resp.response.user) {
              ConfigApi.setToken(resp.response.token);
              ConfigApi.setUser(resp.response.user);
            } else {
              //Throw Error
            }
          }

          return resp;
        }),
        catchError(err => {
          let user_message = this.catchMessage.getMessage(err);
          throw user_message;
        })
      );
  }

  private setOptions(body?: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Content-Type", "application/json");
    headers = headers.append("Accept", "application/json");
    return {
      headers
    };
  }
}
