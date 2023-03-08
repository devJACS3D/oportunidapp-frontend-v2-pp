import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { IUser } from '@apptypes/entities/IUser';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService implements Resolve<IUser> {

  constructor(private _api: Api) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const id = route.params.id;
    let user: IUser = {};
    if (!id) {
      return of(user);
    }
    return this._api.get(Entities.getUser, id).pipe(
      map((response: ApiResponse) => {
        user = response.response;
        return user;
      })
    )
  }
}
