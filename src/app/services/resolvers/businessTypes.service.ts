import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '@apptypes/api-response';
import { Entities } from '@services/entities';
import { Api } from '@utils/api';
import { catchError, map} from 'rxjs/operators';
import { DialogService } from 'src/app/components/dialog-alert/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessTypesResolverService implements Resolve<any> {

  constructor(private _api: Api,private _dialog:DialogService) { }
  resolve(_activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._api.get(Entities.businessTypes).pipe(
      map((response: ApiResponse) => response.response),
      catchError((error) => {
        this._dialog.error(error);
        throw error;
      })
    )

  }
}
