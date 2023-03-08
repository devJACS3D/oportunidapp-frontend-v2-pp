import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route,
  UrlSegment
} from "@angular/router";
import { UserAccountService } from "@services/user-account.service";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class IsAuthenticatedGuard implements CanLoad,CanActivate {
  constructor(private auth: UserAccountService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.auth.isUserLoggedHttp().pipe(
      tap(),
      map(res => {
        return res.response !== null && res.response !== undefined;
      }),
      catchError(error => of(false))
    );
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isUserLoggedHttp().pipe(
      tap(res => this.auth.setUser(res.response)),
      map(res => {
        return res.response !== null && res.response !== undefined;
      }),
      catchError(error => of(false))
    );
  }
}
