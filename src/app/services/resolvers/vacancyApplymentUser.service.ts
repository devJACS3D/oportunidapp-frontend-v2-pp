import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { IUser } from '@apptypes/entities/IUser';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map } from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyApplymentUserResolverService implements Resolve<IUser> {

  constructor(private _api: Api, private _dialog: DialogService) { }
  resolve(_activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const vaid = _activatedRouteSnapshot.params.vaid;

    const url = Entities.companyVacancyApplymentUser

    return this._api.get(url,vaid).pipe(
      map((response: ApiResponse) => response.response),
      catchError((error) => {
        this._dialog.error(error);
        throw error;
      })
    )
  }
}
