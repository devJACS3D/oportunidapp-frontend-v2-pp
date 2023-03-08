import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject, of } from "rxjs";
import { Utilities } from "@utils/utilities";
import { LoggedUser } from "@apptypes/types";
import { shareReplay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Entities } from "./entities";
import { ConfigApi } from "@utils/config-api";

@Injectable({
  providedIn: "root"
})
export class UserAccountService {
  // null means no user Logged in
  private user$ = new BehaviorSubject<LoggedUser | null>(null);
  private baseUrl = ConfigApi.baseUrl;
  constructor(private http: HttpClient) {}

  /* ................................................................................................. */
  /* V2 NEW METHODS ADDED TO HANDLE USER LOGGED */
  /* ................................................................................................. */
  public setUser(user: any | null) {
    if (user) user = this.mapUserRoles(user);
    this.user$.next(user);
  }
  
  public isUserLogged(): void {
    let user = JSON.parse(localStorage.getItem("current_user"));
    if (user) {
      user = this.mapUserRoles(user);
    }
    return this.user$.next(user);
  }
  
  public isUserLoggedHttp(): Observable<any> {
    // this will mock the http response when there's no user.
    if (!ConfigApi.tokenAutentication) return of({ response: null });

    const autorization: string = "Bearer " + ConfigApi.tokenAutentication;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("Authorization", autorization);
    return this.http.get(`${this.baseUrl}${Entities.authorization}/users/me`, {
      headers
    });
  }

  public getUser$<T = LoggedUser>() {
    return this.user$.pipe(shareReplay(1)) as Observable<T | null>;
  }

  public getUser<T extends object = LoggedUser>() {
    const user = this.user$.getValue() as T;
    //returns a copy of the user. This way we do not mutate the original.
    return {...(user as object)} as T
  }

  mapUserRoles(user): object {
    user.isAdminProfile = user.userTypeId == 1 ? true : false;
    user.isPsychologistProfile = user.userTypeId == 2 ? true : false;
    user.isBusinessProfile = user.userTypeId == 3 ? true : false;
    user.isAgentProfile = user.userTypeId == 4 ? true : false;
    user["temporality"] = false;
    return user;
  }
}
